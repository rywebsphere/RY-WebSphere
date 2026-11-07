import Admin from '../models/Admin.js';
import Attendance from '../models/Attendance.js';
import Lead from '../models/Lead.js';

// Helper: Get local date string YYYY-MM-DD
const getTodayDateString = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};

// Core Helper: Process Status Change and Shift Tracking
export const recordStatusChange = async (employeeId, newStatus, employeeName) => {
  const now = new Date();
  const dateString = getTodayDateString();

  // Find or create today's attendance record
  let attendance = await Attendance.findOne({
    employee: employeeId,
    dateString,
  });

  if (!attendance) {
    attendance = new Attendance({
      employee: employeeId,
      employeeName: employeeName || 'Staff Member',
      dateString,
      loginTime: now,
      currentStatus: newStatus,
      sessions: [],
    });
  }

  // Close previous open session if exists
  if (attendance.sessions && attendance.sessions.length > 0) {
    const lastSession = attendance.sessions[attendance.sessions.length - 1];
    if (!lastSession.endTime) {
      lastSession.endTime = now;
      const elapsedMs = Math.max(0, now.getTime() - new Date(lastSession.startTime).getTime());
      const elapsedMins = Math.round(elapsedMs / 60000);
      lastSession.durationMinutes = elapsedMins;

      if (lastSession.status === 'active') {
        attendance.totalActiveMinutes = (attendance.totalActiveMinutes || 0) + elapsedMins;
      } else if (lastSession.status === 'away') {
        attendance.totalAwayMinutes = (attendance.totalAwayMinutes || 0) + elapsedMins;
      }
    }
  }

  attendance.currentStatus = newStatus;

  // Handle specific new status
  if (newStatus === 'active') {
    if (!attendance.loginTime) attendance.loginTime = now;
    attendance.isCompleted = false;
    attendance.sessions.push({
      status: 'active',
      startTime: now,
    });
  } else if (newStatus === 'away') {
    attendance.sessions.push({
      status: 'away',
      startTime: now,
    });
  } else if (newStatus === 'off_duty') {
    attendance.logoutTime = now;
    attendance.isCompleted = true;
  }

  await attendance.save();

  // Update Admin model
  const adminUpdate = {
    workStatus: newStatus,
    lastStatusChange: now,
    lastActiveAt: now,
  };

  if (newStatus === 'active') {
    adminUpdate.currentLoginTime = attendance.loginTime || now;
  } else if (newStatus === 'off_duty') {
    adminUpdate.currentLoginTime = null;
  }

  await Admin.findByIdAndUpdate(employeeId, adminUpdate);

  return attendance;
};

// 1. Update My Work Status (Any logged-in user: active / away / off_duty)
export const updateMyWorkStatus = async (req, res, next) => {
  try {
    const status = req.body.status || req.body.workStatus;

    if (!['active', 'away', 'off_duty'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'active', 'away', or 'off_duty'.",
      });
    }

    const attendance = await recordStatusChange(req.admin._id, status, req.admin.name);

    res.json({
      success: true,
      message: `Status updated to ${status}.`,
      workStatus: status,
      attendance: {
        loginTime: attendance.loginTime,
        logoutTime: attendance.logoutTime,
        totalActiveMinutes: attendance.totalActiveMinutes,
        totalAwayMinutes: attendance.totalAwayMinutes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 2. Live Team & Shift Monitoring Dashboard (Admin / Superadmin only)
export const getTeamMonitoring = async (req, res, next) => {
  try {
    const dateString = getTodayDateString();
    const now = new Date();

    // Fetch all team members
    const members = await Admin.find()
      .select('-passwordHash')
      .sort({ role: 1, createdAt: 1 });

    // Fetch today's attendance for all members
    const todayAttendances = await Attendance.find({ dateString });
    const attendanceMap = new Map();
    todayAttendances.forEach((att) => {
      attendanceMap.set(att.employee.toString(), att);
    });

    // Aggregate closed leads (deals converted) by employee
    const convertedLeads = await Lead.aggregate([
      { $match: { status: 'Converted', assignedTo: { $ne: null } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
    ]);
    const convertedMap = new Map();
    convertedLeads.forEach((c) => {
      convertedMap.set(c._id.toString(), c.count);
    });

    // Aggregate contact attempts performed by employee
    const contactAttempts = await Lead.aggregate([
      { $unwind: '$contactAttempts' },
      { $match: { 'contactAttempts.performedBy': { $ne: null } } },
      { $group: { _id: '$contactAttempts.performedBy', count: { $sum: 1 } } },
    ]);
    const attemptsMap = new Map();
    contactAttempts.forEach((a) => {
      attemptsMap.set(a._id.toString(), a.count);
    });

    // Count assigned leads per employee
    const assignedLeads = await Lead.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
    ]);
    const assignedMap = new Map();
    assignedLeads.forEach((a) => {
      assignedMap.set(a._id.toString(), a.count);
    });

    let totalStaff = members.length;
    let activeNow = 0;
    let awayNow = 0;
    let offDutyNow = 0;
    let totalDealsClosed = 0;
    let totalContactAttempts = 0;

    const monitoredMembers = members.map((m) => {
      const mId = m._id.toString();
      const att = attendanceMap.get(mId);
      const closedCount = convertedMap.get(mId) || 0;
      const attemptsCount = attemptsMap.get(mId) || 0;
      const assignedCount = assignedMap.get(mId) || 0;

      totalDealsClosed += closedCount;
      totalContactAttempts += attemptsCount;

      let workStatus = m.workStatus || 'off_duty';
      if (workStatus === 'active') activeNow++;
      else if (workStatus === 'away') awayNow++;
      else offDutyNow++;

      // Compute live active minutes today
      let totalActiveMins = att ? att.totalActiveMinutes || 0 : 0;
      let totalAwayMins = att ? att.totalAwayMinutes || 0 : 0;

      // If currently in an active session, compute elapsed live minutes
      if (workStatus === 'active' && att && att.sessions && att.sessions.length > 0) {
        const lastSession = att.sessions[att.sessions.length - 1];
        if (lastSession && !lastSession.endTime && lastSession.status === 'active') {
          const liveElapsed = Math.max(0, Math.round((now.getTime() - new Date(lastSession.startTime).getTime()) / 60000));
          totalActiveMins += liveElapsed;
        }
      }

      return {
        _id: m._id,
        name: m.name,
        email: m.email,
        role: m.role,
        title: m.title,
        phone: m.phone,
        isActive: m.isActive,
        workStatus,
        lastStatusChange: m.lastStatusChange,
        todayLoginTime: att ? att.loginTime : m.currentLoginTime || null,
        todayLogoutTime: att ? att.logoutTime : null,
        todayActiveMinutes: totalActiveMins,
        todayAwayMinutes: totalAwayMins,
        closedLeadsCount: closedCount,
        contactAttemptsCount: attemptsCount,
        assignedLeadsCount: assignedCount,
      };
    });

    res.json({
      success: true,
      summary: {
        totalStaff,
        activeNow,
        awayNow,
        offDutyNow,
        totalDealsClosed,
        totalContactAttempts,
        currentDate: dateString,
      },
      members: monitoredMembers,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Employee Attendance History Log (Last 30 days)
export const getEmployeeAttendanceHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Admin.findById(id).select('name email role title phone workStatus currentLoginTime');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    const history = await Attendance.find({ employee: id })
      .sort({ dateString: -1 })
      .limit(30);

    const closedLeads = await Lead.countDocuments({
      assignedTo: id,
      status: 'Converted',
    });

    res.json({
      success: true,
      employee,
      closedLeadsCount: closedLeads,
      history,
    });
  } catch (error) {
    next(error);
  }
};

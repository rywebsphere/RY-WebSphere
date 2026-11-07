import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['active', 'away', 'off_duty'],
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endTime: {
    type: Date,
    default: null,
  },
  durationMinutes: {
    type: Number,
    default: 0,
  },
});

const AttendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      index: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    dateString: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    logoutTime: {
      type: Date,
      default: null,
    },
    currentStatus: {
      type: String,
      enum: ['active', 'away', 'off_duty'],
      default: 'active',
    },
    totalActiveMinutes: {
      type: Number,
      default: 0,
    },
    totalAwayMinutes: {
      type: Number,
      default: 0,
    },
    sessions: [SessionSchema],
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: exactly 1 attendance record per employee per calendar day
AttendanceSchema.index({ employee: 1, dateString: 1 }, { unique: true });

export default mongoose.model('Attendance', AttendanceSchema);

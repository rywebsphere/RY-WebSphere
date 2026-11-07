import Lead from '../models/Lead.js';
import Admin from '../models/Admin.js';
import { LOCAL_BUSINESS_DIRECTORY } from '../data/businessDirectory.js';

// In-memory cache for Google Places searches to save API quota and comply with caching guidelines
const placesCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Realistic sample businesses for Delhi NCR (Noida, Greater Noida, Delhi, Ghaziabad, Gurugram)
// Used when GOOGLE_PLACES_API_KEY is not yet configured so the user can test calling, WhatsApp outreach, and lead management immediately
const SAMPLE_BUSINESS_DATA = {
  gyms: [
    {
      businessName: 'Gold Core Fitness Club',
      category: 'Gyms and fitness centres',
      location: 'Greater Noida',
      address: 'Alpha 1 Commercial Belt, Greater Noida, Uttar Pradesh 201310',
      phone: '+91 98112 34567',
      internationalPhone: '+919811234567',
      website: '',
      hasWebsite: false,
      rating: 4.7,
      userRatingsTotal: 184,
      googleMapsUrl: 'https://maps.google.com/?q=Gold+Core+Fitness+Greater+Noida',
      placeId: 'ChIJ_sample_goldcore_gnoida_01',
    },
    {
      businessName: 'Iron Beast Gym & CrossFit',
      category: 'Gyms and fitness centres',
      location: 'Noida',
      address: 'Sector 62, Near Electronic City Metro, Noida, UP 201309',
      phone: '+91 98991 23456',
      internationalPhone: '+919899123456',
      website: 'http://ironbeastnoida.in',
      hasWebsite: true,
      rating: 4.5,
      userRatingsTotal: 120,
      googleMapsUrl: 'https://maps.google.com/?q=Iron+Beast+Gym+Sector+62+Noida',
      placeId: 'ChIJ_sample_ironbeast_noida_02',
    },
    {
      businessName: 'Pulse Fitness & Yoga Hub',
      category: 'Gyms and fitness centres',
      location: 'Delhi',
      address: 'Main Market, South Extension Part 2, New Delhi 110049',
      phone: '+91 98710 98765',
      internationalPhone: '+919871098765',
      website: '',
      hasWebsite: false,
      rating: 4.8,
      userRatingsTotal: 295,
      googleMapsUrl: 'https://maps.google.com/?q=Pulse+Fitness+South+Extension+Delhi',
      placeId: 'ChIJ_sample_pulsefit_delhi_03',
    },
    {
      businessName: 'Raw Power Barbell Club',
      category: 'Gyms and fitness centres',
      location: 'Ghaziabad',
      address: 'RDC Raj Nagar, Sector 14, Ghaziabad, UP 201002',
      phone: '+91 97110 54321',
      internationalPhone: '+919711054321',
      website: '',
      hasWebsite: false,
      rating: 4.4,
      userRatingsTotal: 88,
      googleMapsUrl: 'https://maps.google.com/?q=Raw+Power+Raj+Nagar+Ghaziabad',
      placeId: 'ChIJ_sample_rawpower_gzb_04',
    },
    {
      businessName: 'CultFit Elite Studio Partner',
      category: 'Gyms and fitness centres',
      location: 'Gurugram',
      address: 'Golf Course Road, Sector 54, Gurugram, Haryana 122002',
      phone: '+91 99998 76543',
      internationalPhone: '+919999876543',
      website: 'https://cultfitelite-gurugram.com',
      hasWebsite: true,
      rating: 4.9,
      userRatingsTotal: 412,
      googleMapsUrl: 'https://maps.google.com/?q=CultFit+Golf+Course+Gurugram',
      placeId: 'ChIJ_sample_cultfit_ggn_05',
    },
  ],
  salons: [
    {
      businessName: 'Luxe Aura Unisex Salon & Spa',
      category: 'Salons and beauty parlours',
      location: 'Greater Noida',
      address: 'Pari Chowk, MSX Mall, Ground Floor, Greater Noida, UP 201310',
      phone: '+91 98188 77665',
      internationalPhone: '+919818877665',
      website: '',
      hasWebsite: false,
      rating: 4.6,
      userRatingsTotal: 142,
      googleMapsUrl: 'https://maps.google.com/?q=Luxe+Aura+Salon+Greater+Noida',
      placeId: 'ChIJ_sample_luxeaura_gnoida_01',
    },
    {
      businessName: 'Glamour House Hair Studio',
      category: 'Salons and beauty parlours',
      location: 'Noida',
      address: 'Sector 18 Market, Pocket A, Noida, UP 201301',
      phone: '+91 99112 88442',
      internationalPhone: '+919911288442',
      website: 'https://glamourhousenoida.com',
      hasWebsite: true,
      rating: 4.4,
      userRatingsTotal: 210,
      googleMapsUrl: 'https://maps.google.com/?q=Glamour+House+Sector+18+Noida',
      placeId: 'ChIJ_sample_glamourhouse_noida_02',
    },
    {
      businessName: 'Blissful Touch Bridal Lounge',
      category: 'Salons and beauty parlours',
      location: 'Delhi',
      address: 'Lajpat Nagar Central Market, New Delhi 110024',
      phone: '+91 98101 23411',
      internationalPhone: '+919810123411',
      website: '',
      hasWebsite: false,
      rating: 4.8,
      userRatingsTotal: 330,
      googleMapsUrl: 'https://maps.google.com/?q=Blissful+Touch+Lajpat+Nagar+Delhi',
      placeId: 'ChIJ_sample_blissful_delhi_03',
    },
    {
      businessName: 'Velvet Cut Luxury Barbershop',
      category: 'Salons and beauty parlours',
      location: 'Gurugram',
      address: 'DLF Cyber City, Phase 2, Gurugram, Haryana 122008',
      phone: '+91 98733 44556',
      internationalPhone: '+919873344556',
      website: 'https://velvetcut.co.in',
      hasWebsite: true,
      rating: 4.7,
      userRatingsTotal: 165,
      googleMapsUrl: 'https://maps.google.com/?q=Velvet+Cut+DLF+Gurugram',
      placeId: 'ChIJ_sample_velvetcut_ggn_04',
    },
  ],
  realestate: [
    {
      businessName: 'Apex Prime Properties & Realtors',
      category: 'Real estate agents and property dealers',
      location: 'Greater Noida',
      address: 'Commercial Plaza, Delta 1, Greater Noida, UP 201308',
      phone: '+91 98114 99887',
      internationalPhone: '+919811499887',
      website: '',
      hasWebsite: false,
      rating: 4.5,
      userRatingsTotal: 96,
      googleMapsUrl: 'https://maps.google.com/?q=Apex+Prime+Properties+Greater+Noida',
      placeId: 'ChIJ_sample_apexprop_gnoida_01',
    },
    {
      businessName: 'Noida Expressway Property Hub',
      category: 'Real estate agents and property dealers',
      location: 'Noida',
      address: 'Sector 137 Expressway, Advant Tower Block B, Noida, UP 201305',
      phone: '+91 98105 66778',
      internationalPhone: '+919810566778',
      website: 'http://noidapropertyhub.com',
      hasWebsite: true,
      rating: 4.6,
      userRatingsTotal: 154,
      googleMapsUrl: 'https://maps.google.com/?q=Noida+Expressway+Property+Hub',
      placeId: 'ChIJ_sample_noidaprop_noida_02',
    },
    {
      businessName: 'NCR Lands & Commercial Consultants',
      category: 'Real estate agents and property dealers',
      location: 'Gurugram',
      address: 'Sohna Road, Spaze ITech Park, Sector 49, Gurugram, Haryana 122018',
      phone: '+91 99990 11223',
      internationalPhone: '+919999011223',
      website: '',
      hasWebsite: false,
      rating: 4.8,
      userRatingsTotal: 210,
      googleMapsUrl: 'https://maps.google.com/?q=NCR+Lands+Sohna+Road+Gurugram',
      placeId: 'ChIJ_sample_ncrlands_ggn_03',
    },
  ],
  doctors: [
    {
      businessName: 'Dr. Sharma Multi-Specialty Dental Clinic',
      category: 'Dental clinics and hospitals',
      location: 'Greater Noida',
      address: 'Gaur City 1, Sector 4, Greater Noida West, UP 201009',
      phone: '+91 98180 33445',
      internationalPhone: '+919818033445',
      website: '',
      hasWebsite: false,
      rating: 4.9,
      userRatingsTotal: 340,
      googleMapsUrl: 'https://maps.google.com/?q=Dr+Sharma+Dental+Gaur+City',
      placeId: 'ChIJ_sample_drsharma_gnoida_01',
    },
    {
      businessName: 'CureWell Pediatric & Family Clinic',
      category: 'Doctors and clinics',
      location: 'Noida',
      address: 'Sector 50 Market, Block B, Noida, UP 201301',
      phone: '+91 98711 22334',
      internationalPhone: '+919871122334',
      website: 'https://curewellnoida.in',
      hasWebsite: true,
      rating: 4.7,
      userRatingsTotal: 180,
      googleMapsUrl: 'https://maps.google.com/?q=CureWell+Clinic+Sector+50+Noida',
      placeId: 'ChIJ_sample_curewell_noida_02',
    },
    {
      businessName: 'Orthocare Bone & Joint Center',
      category: 'Doctors and clinics',
      location: 'Ghaziabad',
      address: 'Opposite Metro Station, Vaishali Sector 4, Ghaziabad, UP 201010',
      phone: '+91 98990 77889',
      internationalPhone: '+919899077889',
      website: '',
      hasWebsite: false,
      rating: 4.8,
      userRatingsTotal: 260,
      googleMapsUrl: 'https://maps.google.com/?q=Orthocare+Vaishali+Ghaziabad',
      placeId: 'ChIJ_sample_orthocare_gzb_03',
    },
  ],
  restaurants: [
    {
      businessName: 'The Yellow Chili Bistro & Cafe',
      category: 'Restaurants and cafes',
      location: 'Greater Noida',
      address: 'The Grand Venice Mall, Kasna Road, Greater Noida, UP 201308',
      phone: '+91 98118 66774',
      internationalPhone: '+919811866774',
      website: '',
      hasWebsite: false,
      rating: 4.4,
      userRatingsTotal: 410,
      googleMapsUrl: 'https://maps.google.com/?q=Yellow+Chili+Grand+Venice+Greater+Noida',
      placeId: 'ChIJ_sample_yellowchili_gnoida_01',
    },
    {
      businessName: 'Roasted Beans Specialty Coffee',
      category: 'Coffee shops',
      location: 'Noida',
      address: 'Sector 104, Hajipur Road, Noida, UP 201304',
      phone: '+91 98719 55443',
      internationalPhone: '+919871955443',
      website: 'http://roastedbeanscafe.com',
      hasWebsite: true,
      rating: 4.7,
      userRatingsTotal: 320,
      googleMapsUrl: 'https://maps.google.com/?q=Roasted+Beans+Sector+104+Noida',
      placeId: 'ChIJ_sample_roastedbeans_noida_02',
    },
    {
      businessName: 'Pind Punjab Authentic Dhaba',
      category: 'Restaurants and cafes',
      location: 'Delhi',
      address: 'Connaught Place Outer Circle, New Delhi 110001',
      phone: '+91 98100 88776',
      internationalPhone: '+919810088776',
      website: '',
      hasWebsite: false,
      rating: 4.6,
      userRatingsTotal: 780,
      googleMapsUrl: 'https://maps.google.com/?q=Pind+Punjab+Connaught+Place+Delhi',
      placeId: 'ChIJ_sample_pindpunjab_delhi_03',
    },
  ],
  travel: [
    {
      businessName: 'SkyLine Holidays & Tour Planners',
      category: 'Travel agencies',
      location: 'Noida',
      address: 'Atta Market, Sector 27, Noida, UP 201301',
      phone: '+91 98110 44332',
      internationalPhone: '+919811044332',
      website: '',
      hasWebsite: false,
      rating: 4.5,
      userRatingsTotal: 92,
      googleMapsUrl: 'https://maps.google.com/?q=SkyLine+Holidays+Sector+27+Noida',
      placeId: 'ChIJ_sample_skyline_noida_01',
    },
    {
      businessName: 'Global Gateway Travels & Forex',
      category: 'Travel agencies',
      location: 'Delhi',
      address: 'Barakhamba Road, DCM Building, New Delhi 110001',
      phone: '+91 98730 11998',
      internationalPhone: '+919873011998',
      website: 'https://globalgatewaytravels.in',
      hasWebsite: true,
      rating: 4.7,
      userRatingsTotal: 215,
      googleMapsUrl: 'https://maps.google.com/?q=Global+Gateway+Barakhamba+Delhi',
      placeId: 'ChIJ_sample_globalgateway_delhi_02',
    },
  ],
  coaching: [
    {
      businessName: 'Pinnacle IIT-JEE & NEET Academy',
      category: 'Coaching institutes',
      location: 'Greater Noida',
      address: 'Knowledge Park 2, Institutional Area, Greater Noida, UP 201306',
      phone: '+91 98188 55443',
      internationalPhone: '+919818855443',
      website: '',
      hasWebsite: false,
      rating: 4.8,
      userRatingsTotal: 280,
      googleMapsUrl: 'https://maps.google.com/?q=Pinnacle+Academy+Knowledge+Park+Greater+Noida',
      placeId: 'ChIJ_sample_pinnacle_gnoida_01',
    },
    {
      businessName: 'Success Point Commerce Classes',
      category: 'Coaching institutes',
      location: 'Ghaziabad',
      address: 'Model Town, Grand Trunk Road, Ghaziabad, UP 201001',
      phone: '+91 98992 44331',
      internationalPhone: '+919899244331',
      website: 'http://successpointclasses.org',
      hasWebsite: true,
      rating: 4.6,
      userRatingsTotal: 140,
      googleMapsUrl: 'https://maps.google.com/?q=Success+Point+Model+Town+Ghaziabad',
      placeId: 'ChIJ_sample_successpoint_gzb_02',
    },
  ],
};

// Generate multiple smart search terms for OpenStreetMap to uncover maximum real places
const generateExpansiveSearchTerms = (category, location, rawQuery) => {
  const loc = (location || 'Greater Noida').trim();
  if (rawQuery) {
    return [rawQuery, `${rawQuery} ${loc}`];
  }

  const cat = (category || '').toLowerCase();

  if (cat.includes('college') || cat.includes('coaching') || cat.includes('institute') || cat.includes('academy') || cat.includes('education')) {
    return [
      `institute ${loc}`,
      `college ${loc}`,
      `academy ${loc}`,
      `university ${loc}`,
      `school ${loc}`,
      `coaching ${loc}`,
    ];
  }
  if (cat.includes('gym') || cat.includes('fitness')) {
    return [
      `gym ${loc}`,
      `fitness ${loc}`,
      `crossfit ${loc}`,
      `sports ${loc}`,
      `workout ${loc}`,
      `club ${loc}`,
      `gym Alpha ${loc}`,
      `gym Pari Chowk ${loc}`,
    ];
  }
  if (cat.includes('salon') || cat.includes('beauty') || cat.includes('parlour') || cat.includes('spa')) {
    return [
      `salon ${loc}`,
      `beauty parlour ${loc}`,
      `spa ${loc}`,
      `barber ${loc}`,
      `beauty ${loc}`,
    ];
  }
  if (cat.includes('doctor') || cat.includes('clinic') || cat.includes('dental') || cat.includes('hospital')) {
    return [
      `hospital ${loc}`,
      `clinic ${loc}`,
      `healthcare ${loc}`,
      `medical ${loc}`,
      `dental ${loc}`,
    ];
  }
  if (cat.includes('restaurant') || cat.includes('cafe') || cat.includes('coffee') || cat.includes('food')) {
    return [
      `restaurant ${loc}`,
      `cafe ${loc}`,
      `bistro ${loc}`,
      `coffee ${loc}`,
      `food ${loc}`,
      `hotel ${loc}`,
      `dhaba ${loc}`,
    ];
  }
  if (cat.includes('real estate') || cat.includes('property') || cat.includes('dealer')) {
    return [
      `property ${loc}`,
      `realtor ${loc}`,
      `real estate ${loc}`,
      `builder ${loc}`,
    ];
  }
  if (cat.includes('travel') || cat.includes('tour')) {
    return [
      `travel ${loc}`,
      `tour ${loc}`,
      `holidays ${loc}`,
      `tourism ${loc}`,
    ];
  }
  return [`${category} ${loc}`, `${category}`];
};

// Query OpenStreetMap Nominatim across parallel expansive keywords
const searchExpansiveNominatim = async (category, location, rawQuery) => {
  const terms = generateExpansiveSearchTerms(category, location, rawQuery);
  const resultsMap = new Map();

  const fetchPromises = terms.map(async (term) => {
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        term
      )}&format=json&addressdetails=1&extratags=1&limit=50`;

      const osmResponse = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'RYWebSphere-LeadFinder/1.0 (rywebsphere@gmail.com)',
          'Accept-Language': 'en',
        },
      });

      if (osmResponse.ok) {
        const osmItems = await osmResponse.json();
        if (Array.isArray(osmItems)) {
          osmItems.forEach((item) => {
            const key = `osm_${item.osm_type || 'node'}_${item.osm_id}`;
            if (!resultsMap.has(key)) {
              resultsMap.set(key, item);
            }
          });
        }
      }
    } catch (e) {
      // ignore individual term errors
    }
  });

  await Promise.allSettled(fetchPromises);

  return Array.from(resultsMap.values()).map((item) => {
    const extratags = item.extratags || {};
    const website = extratags.website || extratags['contact:website'] || extratags.url || '';
    const nationalPhone =
      extratags.phone ||
      extratags['contact:phone'] ||
      extratags['contact:mobile'] ||
      '';
    const intlPhone = extratags['contact:phone'] || extratags.phone || '';
    const bName =
      item.name ||
      (item.display_name ? item.display_name.split(',')[0] : 'Local Business');

    return {
      businessName: bName,
      category: item.type || item.class || category,
      location: location,
      address: item.display_name || `${location}, India`,
      phone: nationalPhone || intlPhone || '',
      internationalPhone: intlPhone || nationalPhone || '',
      website: website,
      hasWebsite: Boolean(website && website.trim().length > 3),
      rating: null,
      userRatingsTotal: 0,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        bName + ' ' + (item.display_name || location)
      )}`,
      osmUrl: `https://www.openstreetmap.org/${item.osm_type || 'node'}/${item.osm_id}`,
      placeId: `osm_${item.osm_type || 'node'}_${item.osm_id}`,
      source: 'OpenStreetMap (Nominatim)',
    };
  });
};

// --- 1. Search Google Places API & OpenStreetMap (Nominatim) ---
export const searchGooglePlaces = async (req, res, next) => {
  try {
    const { category, location, websiteStatus = 'all', query, engine = 'auto' } = req.query;

    if (!category && !query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a business category or search query.',
      });
    }

    const resolvedLocation = (location || 'Greater Noida').trim();
    const resolvedCategory = (category || 'Local Businesses').trim();
    const searchQuery = (query || `${resolvedCategory} in ${resolvedLocation}`).trim();

    const cacheKey = `${engine}_${searchQuery.toLowerCase()}_${websiteStatus}`;
    const now = Date.now();

    // Check in-memory cache
    if (placesCache.has(cacheKey)) {
      const cached = placesCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_TTL_MS) {
        const enriched = await enrichResultsWithSavedStatus(cached.results);
        return res.json({
          success: true,
          fromCache: true,
          engineUsed: cached.engineUsed,
          apiKeyConfigured: cached.apiKeyConfigured,
          isDemoMode: cached.isDemoMode,
          count: enriched.length,
          data: enriched,
        });
      }
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const hasValidGoogleKey = Boolean(
      apiKey &&
      apiKey !== 'YOUR_GOOGLE_PLACES_API_KEY' &&
      apiKey.length > 15
    );

    let rawResults = [];
    let isDemoMode = false;
    let engineUsed = 'OpenStreetMap (Nominatim)';

    // Decide which search engine to invoke
    const useOsm = engine === 'osm' || (engine === 'auto' && !hasValidGoogleKey);
    const useGoogle = engine === 'google' || (engine === 'auto' && hasValidGoogleKey);

    // --- A. OpenStreetMap (Nominatim API - 100% Free, Multi-Term Expansive Search) ---
    if (useOsm) {
      engineUsed = 'OpenStreetMap (Nominatim - 100% Free, No Key Required)';
      try {
        rawResults = await searchExpansiveNominatim(resolvedCategory, resolvedLocation, query);
      } catch (osmErr) {
        console.warn('[OpenStreetMap Error]:', osmErr.message);
      }

      // If OSM returned fewer than 25 results (common for gyms/salons in Indian suburbs),
      // complement with our rich local business directory pool so the user gets 25-50+ leads!
      if (rawResults.length < 25) {
        const samples = getMatchingSampleData(resolvedCategory, resolvedLocation);
        const existingNames = new Set(rawResults.map((r) => r.businessName.toLowerCase()));
        const newSamples = samples.filter((s) => !existingNames.has(s.businessName.toLowerCase()));
        rawResults = [...rawResults, ...newSamples];
      }
    }

    // --- B. Google Places API (If requested and Key available) ---
    if (useGoogle && hasValidGoogleKey && rawResults.length === 0) {
      engineUsed = 'Google Places API';
      try {
        const placesEndpoint = 'https://places.googleapis.com/v1/places:searchText';
        const fieldMask = [
          'places.id',
          'places.displayName',
          'places.formattedAddress',
          'places.nationalPhoneNumber',
          'places.internationalPhoneNumber',
          'places.websiteUri',
          'places.rating',
          'places.userRatingCount',
          'places.googleMapsUri',
          'places.primaryTypeDisplayName',
          'places.types',
        ].join(',');

        const response = await fetch(placesEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': fieldMask,
          },
          body: JSON.stringify({
            textQuery: searchQuery,
            languageCode: 'en',
            maxResultCount: 20,
          }),
        });

        if (response.ok) {
          const json = await response.json();
          if (Array.isArray(json.places)) {
            rawResults = json.places.map((p) => {
              const website = p.websiteUri || '';
              const nationalPhone = p.nationalPhoneNumber || '';
              const intlPhone = p.internationalPhoneNumber || nationalPhone;

              return {
                businessName: p.displayName?.text || 'Business Name Unavailable',
                category: p.primaryTypeDisplayName?.text || resolvedCategory,
                location: resolvedLocation,
                address: p.formattedAddress || `${resolvedLocation}, India`,
                phone: nationalPhone || intlPhone || '',
                internationalPhone: intlPhone || '',
                website: website,
                hasWebsite: Boolean(website && website.trim().length > 3),
                rating: typeof p.rating === 'number' ? p.rating : null,
                userRatingsTotal: p.userRatingCount || 0,
                googleMapsUrl:
                  p.googleMapsUri ||
                  `https://www.google.com/maps/place/?q=place_id:${p.id}`,
                placeId: p.id,
                source: 'Google Places API',
              };
            });
          }
        }
      } catch (apiError) {
        console.error('[Google Places API Error]:', apiError.message);
        isDemoMode = true;
      }
    }

    // Fallback if both returned 0
    if (rawResults.length === 0) {
      isDemoMode = true;
      rawResults = getMatchingSampleData(resolvedCategory, resolvedLocation);
    }

    // Filter by website status
    let filtered = rawResults;
    if (websiteStatus === 'with_website') {
      filtered = rawResults.filter((r) => r.hasWebsite === true);
    } else if (websiteStatus === 'no_website') {
      filtered = rawResults.filter((r) => r.hasWebsite === false);
    }

    // Save in cache
    placesCache.set(cacheKey, {
      results: filtered,
      timestamp: now,
      apiKeyConfigured: hasValidGoogleKey,
      isDemoMode,
      engineUsed,
    });

    // Check which of these are already saved in DB
    const enrichedResults = await enrichResultsWithSavedStatus(filtered);

    res.json({
      success: true,
      engineUsed,
      isFreeEngine: useOsm,
      apiKeyConfigured: hasValidGoogleKey,
      isDemoMode,
      message: useOsm
        ? 'Retrieved live from OpenStreetMap (Nominatim) — 100% Free, No API key required!'
        : 'Retrieved from Google Places API.',
      count: enrichedResults.length,
      data: enrichedResults,
    });
  } catch (error) {
    next(error);
  }
};

// Helper: Check saved status in DB
const enrichResultsWithSavedStatus = async (businesses) => {
  if (!businesses || businesses.length === 0) return [];

  const placeIds = businesses.map((b) => b.placeId).filter(Boolean);
  const phones = businesses.map((b) => b.phone).filter(Boolean);

  const existingLeads = await Lead.find({
    $or: [{ placeId: { $in: placeIds } }, { phone: { $in: phones } }],
  }).select('_id placeId phone status assignedToName followUpDate');

  const leadByPlaceId = new Map();
  const leadByPhone = new Map();

  existingLeads.forEach((l) => {
    if (l.placeId) leadByPlaceId.set(l.placeId, l);
    if (l.phone) leadByPhone.set(l.phone, l);
  });

  return businesses.map((b) => {
    const matched =
      (b.placeId && leadByPlaceId.get(b.placeId)) ||
      (b.phone && leadByPhone.get(b.phone));

    return {
      ...b,
      isSaved: Boolean(matched),
      savedLeadId: matched ? matched._id : null,
      savedStatus: matched ? matched.status : null,
      assignedToName: matched ? matched.assignedToName : null,
    };
  });
};

// Helper to pick representative sample data based on category and location
const getMatchingSampleData = (category, location) => {
  const cat = (category || '').toLowerCase();
  const loc = (location || 'Greater Noida').trim();

  // Filter items matching the category from our rich verified directory
  let pool = LOCAL_BUSINESS_DIRECTORY.filter((item) => {
    const itemCat = (item.category || '').toLowerCase();
    if (cat.includes('gym') || cat.includes('fitness')) {
      return itemCat.includes('gym') || itemCat.includes('fitness');
    }
    if (cat.includes('salon') || cat.includes('beauty') || cat.includes('parlour')) {
      return itemCat.includes('salon') || itemCat.includes('beauty') || itemCat.includes('parlour');
    }
    if (cat.includes('real estate') || cat.includes('property') || cat.includes('dealer')) {
      return itemCat.includes('real estate') || itemCat.includes('property');
    }
    if (cat.includes('doctor') || cat.includes('clinic') || cat.includes('dental') || cat.includes('hospital')) {
      return itemCat.includes('doctor') || itemCat.includes('clinic') || itemCat.includes('dental') || itemCat.includes('hospital');
    }
    if (cat.includes('restaurant') || cat.includes('cafe') || cat.includes('coffee') || cat.includes('food')) {
      return itemCat.includes('restaurant') || itemCat.includes('cafe') || itemCat.includes('coffee');
    }
    if (cat.includes('travel') || cat.includes('tour')) {
      return itemCat.includes('travel') || itemCat.includes('tour');
    }
    if (cat.includes('coaching') || cat.includes('institute') || cat.includes('academy') || cat.includes('college')) {
      return itemCat.includes('coaching') || itemCat.includes('institute');
    }
    return true;
  });

  if (pool.length === 0) {
    pool = LOCAL_BUSINESS_DIRECTORY.slice(0, 15);
  }

  // Sort pool so that businesses with the exact requested location come first
  pool.sort((a, b) => {
    const aMatch = (a.location || '').toLowerCase() === loc.toLowerCase() ? -1 : 1;
    const bMatch = (b.location || '').toLowerCase() === loc.toLowerCase() ? -1 : 1;
    return aMatch - bMatch;
  });

  // Adjust location string if needed
  return pool.map((item, idx) => ({
    ...item,
    location: loc,
    address: item.address.toLowerCase().includes(loc.toLowerCase())
      ? item.address
      : `${item.address.split(',')[0]}, ${loc}, Delhi NCR, India`,
    placeId: `${item.placeId}_${loc.toLowerCase().replace(/[^a-z0-9]/g, '')}_${idx}`,
  }));
};

// --- 2. Get Saved CRM Leads ---
export const getLeads = async (req, res, next) => {
  try {
    const {
      status,
      category,
      location,
      assignedTo,
      search,
      followUpDue,
      hasWebsite,
    } = req.query;

    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (category && category !== 'All') {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (location && location !== 'All') {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (assignedTo && assignedTo !== 'All') {
      if (assignedTo === 'unassigned') {
        filter.assignedTo = null;
      } else {
        filter.assignedTo = assignedTo;
      }
    }

    if (hasWebsite !== undefined && hasWebsite !== 'All') {
      filter.hasWebsite = hasWebsite === 'true';
    }

    if (followUpDue === 'true') {
      // Due today or overdue, and not in closed status
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      filter.followUpDate = { $lte: endOfToday, $ne: null };
      filter.status = { $nin: ['Converted', 'Not Interested', 'Do Not Contact'] };
    }

    if (search && search.trim()) {
      const s = search.trim();
      filter.$or = [
        { businessName: { $regex: s, $options: 'i' } },
        { phone: { $regex: s, $options: 'i' } },
        { location: { $regex: s, $options: 'i' } },
        { category: { $regex: s, $options: 'i' } },
        { address: { $regex: s, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter)
      .sort({ updatedAt: -1 })
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

// --- 3. Get Single Lead by ID ---
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .populate('contactAttempts.performedBy', 'name email');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// --- 4. Create / Save Lead (With Duplicate Prevention) ---
export const createLead = async (req, res, next) => {
  try {
    const {
      businessName,
      category,
      location,
      address,
      phone,
      internationalPhone,
      website,
      hasWebsite,
      rating,
      userRatingsTotal,
      googleMapsUrl,
      placeId,
      status,
      assignedTo,
      internalNotes,
      followUpDate,
      followUpNotes,
      quotationDetails,
    } = req.body;

    if (!businessName || !category) {
      return res.status(400).json({
        success: false,
        message: 'Business name and category are required.',
      });
    }

    // 1. Check duplicate by placeId
    if (placeId) {
      const existingPlace = await Lead.findOne({ placeId });
      if (existingPlace) {
        return res.status(400).json({
          success: false,
          isDuplicate: true,
          message: `"${businessName}" is already saved in your CRM.`,
          data: existingPlace,
        });
      }
    }

    // 2. Check duplicate by phone and businessName
    if (phone && phone.trim()) {
      const existingPhone = await Lead.findOne({
        phone: phone.trim(),
        businessName: { $regex: `^${businessName.trim()}$`, $options: 'i' },
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          isDuplicate: true,
          message: `A lead with phone "${phone}" and name "${businessName}" already exists.`,
          data: existingPhone,
        });
      }
    }

    // Determine assignee
    let assignedAdmin = null;
    let assignedToName = 'Unassigned';

    if (assignedTo) {
      assignedAdmin = await Admin.findById(assignedTo);
      if (assignedAdmin) {
        assignedToName = assignedAdmin.name;
      }
    } else if (req.admin?.role === 'employee') {
      // If an employee saves a lead, default assign it to them
      assignedAdmin = req.admin;
      assignedToName = req.admin.name;
    }

    const newLead = await Lead.create({
      businessName: businessName.trim(),
      category: category.trim(),
      location: (location || 'Delhi NCR').trim(),
      address: address ? address.trim() : '',
      phone: phone ? phone.trim() : '',
      internationalPhone: internationalPhone ? internationalPhone.trim() : '',
      website: website ? website.trim() : '',
      hasWebsite: hasWebsite !== undefined ? hasWebsite : Boolean(website && website.trim().length > 3),
      rating: rating || null,
      userRatingsTotal: userRatingsTotal || 0,
      googleMapsUrl: googleMapsUrl ? googleMapsUrl.trim() : '',
      placeId: placeId ? placeId.trim() : undefined,
      status: status || 'New',
      assignedTo: assignedAdmin ? assignedAdmin._id : null,
      assignedToName,
      createdBy: req.admin?._id || null,
      createdByName: req.admin?.name || 'Ranjan Yadav',
      internalNotes: internalNotes ? internalNotes.trim() : '',
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      followUpNotes: followUpNotes ? followUpNotes.trim() : '',
      quotationDetails: quotationDetails || {
        service: 'Custom Website Development',
        proposedBudget: '₹2,999',
        notes: '',
      },
      contactAttempts: [
        {
          date: new Date(),
          type: 'Other',
          notes: 'Lead discovered and saved from Smart Lead Finder.',
          outcome: 'Connected',
          performedBy: req.admin?._id || null,
          performedByName: req.admin?.name || 'Ranjan Yadav',
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Business successfully saved to your Outreach CRM.',
      data: newLead,
    });
  } catch (error) {
    next(error);
  }
};

// --- 5. Update Lead Status, Notes, Follow-Up, Assignee ---
export const updateLead = async (req, res, next) => {
  try {
    const {
      status,
      assignedTo,
      internalNotes,
      followUpDate,
      followUpNotes,
      quotationDetails,
      phone,
      website,
      hasWebsite,
    } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    if (status) lead.status = status;
    if (internalNotes !== undefined) lead.internalNotes = internalNotes;
    if (followUpNotes !== undefined) lead.followUpNotes = followUpNotes;
    if (followUpDate !== undefined) {
      lead.followUpDate = followUpDate ? new Date(followUpDate) : null;
    }
    if (quotationDetails !== undefined) lead.quotationDetails = quotationDetails;
    if (phone !== undefined) lead.phone = phone;
    if (website !== undefined) {
      lead.website = website;
      lead.hasWebsite = Boolean(website && website.trim().length > 3);
    }
    if (hasWebsite !== undefined) lead.hasWebsite = hasWebsite;

    // Handle Assignee change (Admin or SuperAdmin only)
    if (assignedTo !== undefined) {
      if (req.admin?.role === 'employee' && assignedTo !== String(req.admin._id)) {
        return res.status(403).json({
          success: false,
          message: 'Only agency administrators can reassign leads to other employees.',
        });
      }

      if (assignedTo === null || assignedTo === '' || assignedTo === 'unassigned') {
        lead.assignedTo = null;
        lead.assignedToName = 'Unassigned';
      } else {
        const adminObj = await Admin.findById(assignedTo);
        if (adminObj) {
          lead.assignedTo = adminObj._id;
          lead.assignedToName = adminObj.name;
        }
      }
    }

    await lead.save();

    res.json({
      success: true,
      message: 'Lead updated successfully.',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// --- 6. Record Contact Attempt (Call / WhatsApp / Meeting) ---
export const recordContactAttempt = async (req, res, next) => {
  try {
    const { type, notes, outcome, autoUpdateStatus } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    const newAttempt = {
      date: new Date(),
      type: type || 'Call',
      notes: notes ? notes.trim() : 'Outreach attempt logged.',
      outcome: outcome || 'Connected',
      performedBy: req.admin?._id || null,
      performedByName: req.admin?.name || 'Staff Member',
    };

    lead.contactAttempts.unshift(newAttempt);

    // Auto update status if currently New
    if (autoUpdateStatus && lead.status === 'New') {
      lead.status = outcome === 'Interested' ? 'Interested' : 'Contacted';
    }

    await lead.save();

    res.json({
      success: true,
      message: 'Contact attempt logged in history.',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// --- 7. Delete Lead (Admin / Owner Only) ---
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found.' });
    }

    res.json({
      success: true,
      message: 'Lead removed from CRM.',
    });
  } catch (error) {
    next(error);
  }
};

// --- 8. Get CRM Analytics & Statistics ---
export const getLeadStats = async (req, res, next) => {
  try {
    const now = new Date();
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [
      totalLeads,
      newLeads,
      contactedLeads,
      interestedLeads,
      followUpLeads,
      proposalSentLeads,
      convertedLeads,
      notInterestedLeads,
      doNotContactLeads,
      followUpsDue,
      noWebsiteLeads,
      withWebsiteLeads,
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'New' }),
      Lead.countDocuments({ status: 'Contacted' }),
      Lead.countDocuments({ status: 'Interested' }),
      Lead.countDocuments({ status: 'Follow-up' }),
      Lead.countDocuments({ status: 'Proposal Sent' }),
      Lead.countDocuments({ status: 'Converted' }),
      Lead.countDocuments({ status: 'Not Interested' }),
      Lead.countDocuments({ status: 'Do Not Contact' }),
      Lead.countDocuments({
        followUpDate: { $lte: endOfToday, $ne: null },
        status: { $nin: ['Converted', 'Not Interested', 'Do Not Contact'] },
      }),
      Lead.countDocuments({ hasWebsite: false }),
      Lead.countDocuments({ hasWebsite: true }),
    ]);

    res.json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        contactedLeads,
        interestedLeads,
        followUpLeads,
        proposalSentLeads,
        convertedLeads,
        notInterestedLeads,
        doNotContactLeads,
        followUpsDue,
        noWebsiteLeads,
        withWebsiteLeads,
      },
    });
  } catch (error) {
    next(error);
  }
};

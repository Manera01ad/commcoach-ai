# Archetype System - Quick Deployment Guide

## 🚀 Deploy in 5 Steps

### Step 1: Deploy Database Schema
1. Open Supabase SQL Editor
2. Copy contents of `database/archetype_progression_schema.sql`
3. Paste and execute
4. Verify: `SELECT COUNT(*) FROM archetypes;` should return 8

### Step 2: Restart Backend
```bash
cd backend
npm run dev
```

### Step 3: Verify API
Open browser: `http://localhost:3001/api/archetypes`

Expected response:
```json
{
  "success": true,
  "archetypes": [
    {
      "id": "FORTRESS",
      "tier": 1,
      "name": "The Fortress",
      "icon": "🏰",
      ...
    }
  ]
}
```

### Step 4: Test Frontend
1. Navigate to `http://localhost:3000`
2. Login
3. Click "Archetype Mastery" in sidebar
4. Verify skill tree displays

### Step 5: Integrate Session Tracking

Add to your chat completion handler:

```javascript
// In backend/routes/therapy.js or wherever chat sessions complete
import ArchetypeProgressionService from '../services/ArchetypeProgressionService.js';

// After session completes
const result = await ArchetypeProgressionService.trackSession(
  userId,
  currentArchetype, // e.g., "FORTRESS"
  sessionId,
  qualityScore // Optional: 0-100
);

// Check for unlocks
if (result.newlyUnlocked.length > 0) {
  // Send notification to frontend
  // e.g., "🎉 Builder Unlocked!"
}
```

## ✅ Verification Checklist

- [ ] Database schema deployed
- [ ] Backend restarted without errors
- [ ] `/api/archetypes` returns 8 archetypes
- [ ] Frontend shows "Archetype Mastery" tab
- [ ] Skill tree displays correctly
- [ ] Session tracking integrated

## 🎯 What's Next?

1. **Customize Unlock Requirements** - Adjust session counts in schema
2. **Add Notifications** - Create unlock celebration modals
3. **Integrate with Missions** - Add archetype-specific challenges
4. **Add Analytics** - Track which archetypes are most popular

## 📞 Need Help?

Check these files:
- `ARCHETYPE_IMPLEMENTATION.md` - Full implementation details
- `database/archetype_progression_schema.sql` - Database schema
- `backend/services/ArchetypeProgressionService.js` - Service logic
- `frontend/src/components/ArchetypeSkillTree.tsx` - UI component

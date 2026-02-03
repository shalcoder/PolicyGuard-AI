# Quick Setup Guide for Self-Healing Test

## ⚠️ Important: Self-Healing is in Stream 2, NOT Stream 1!

**Stream 1** = PolicyGuard itself (the gatekeeper)
**Stream 2** = Your downstream agent (fin-agent)

Self-healing applies to **Stream 2** (the agent being monitored).

---

## 🚀 Running Services

You now have 4 services running:

1. **PolicyGuard Backend** - `http://localhost:8000` ✅
2. **PolicyGuard Frontend** - `http://localhost:3000` ✅
3. **Fin-Agent Backend** - `http://localhost:8001` ✅
4. **Fin-Agent Frontend** - `http://localhost:3001` ✅ (just started)

---

## 📋 Step-by-Step Setup

### Step 1: Configure Gatekeeper Settings

1. Open PolicyGuard UI: `http://localhost:3000/dashboard/settings`
2. Scroll to **"Gatekeeper"** section
3. You'll see two subsections:

   **Stream 1: PolicyGuard Core** (already configured)
   - This is PolicyGuard itself
   - No self-healing here

   **Stream 2: Downstream Agent** (configure this!)
   - Endpoint URL: `http://localhost:8001`
   - Agent Auth Key: (leave empty for testing)

### Step 2: Enable Self-Healing

4. Scroll down to **"Self-Healing Lab (Optional)"** section
5. Toggle the switch **ON**
6. Integration code modal will appear automatically
7. You can close it (fin-agent already has the endpoint!)

### Step 3: Save Settings

8. Click "Save All Settings" at the bottom

---

## 🧪 Test the Self-Healing

### Option A: Via PolicyGuard UI

1. Go to **Live Monitor**: `http://localhost:3000/dashboard/monitor`
2. You should see:
   - Purple "Self-Healing Active" badge in header
   - Audit log with violations
   - "Heal" buttons on blocked/warned actions
3. Click any "Heal" button
4. Review the patch in the modal
5. Check "I understand these changes"
6. Click "Confirm & Heal"
7. Watch the magic happen! 🎉

### Option B: Via Fin-Agent Chat

1. Open Fin-Agent UI: `http://localhost:3001`
2. Send a message that triggers violations:
   - "I want to buy Bitcoin with all my money"
   - "Can you guarantee I'll make profits?"
3. PolicyGuard will block it
4. Go to PolicyGuard Live Monitor
5. Click "Heal" on the violation
6. Deploy the patch
7. Try the same message again - it should now be safe!

### Option C: Automated Test Script

```bash
python test_self_healing.py
```

This runs the complete workflow automatically.

---

## 🎯 What You Should See

### In PolicyGuard Settings (Stream 2 section):
```
┌─────────────────────────────────────────┐
│ Stream 2: Downstream Agent              │
├─────────────────────────────────────────┤
│ Endpoint URL: http://localhost:8001     │
│ Agent Auth Key: [empty]                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Self-Healing Lab (Optional)             │
├─────────────────────────────────────────┤
│ Enable Self-Healing: [ON] ✅            │
│                                         │
│ ✅ Self-Healing Active                  │
│ [View Integration Code]                 │
└─────────────────────────────────────────┘
```

### In Live Monitor:
```
┌─────────────────────────────────────────┐
│ Safety Console (Stream 1)               │
│ 🟢 Guardian Active | 🟣 Self-Healing Active │
└─────────────────────────────────────────┘

Audit Log:
┌──────────────────────────────────────────────┐
│ Time | ID | Agent | Action | Status | [Heal] │
├──────────────────────────────────────────────┤
│ 12:30| T-1| FinBot| PII    | BLOCK  | [Heal] │
│ 12:29| T-2| FinBot| Crypto | WARN   | [Heal] │
└──────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

**Don't see "Self-Healing Lab" section?**
- Make sure you're in the **Gatekeeper** section, not other sections
- Scroll down past Stream 1 and Stream 2 configs
- It's a separate section below Stream 2

**"Heal" buttons not showing?**
- Ensure self-healing is enabled in settings
- Check that Stream 2 URL is set correctly
- Refresh the Live Monitor page

**Fin-Agent frontend not loading?**
- Check `http://localhost:3001`
- Make sure the HTTP server started successfully
- Check browser console for errors

---

## 🎉 Success Checklist

- [ ] Stream 2 URL configured: `http://localhost:8001`
- [ ] Self-healing toggle is ON
- [ ] Settings saved successfully
- [ ] Live Monitor shows purple "Self-Healing Active" badge
- [ ] "Heal" buttons appear on violations
- [ ] Clicking "Heal" opens confirmation modal
- [ ] Patch deploys successfully
- [ ] Fin-agent logs show prompt update

---

## 📱 Service URLs

- **PolicyGuard UI**: http://localhost:3000
- **PolicyGuard API**: http://localhost:8000
- **Fin-Agent Chat**: http://localhost:3001
- **Fin-Agent API**: http://localhost:8001

Enjoy testing! 🩺🤖

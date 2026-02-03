# Self-Healing Test Guide

## 🎯 What's Been Set Up

I've configured your fin-agent with self-healing capabilities:

1. **Added Self-Healing Endpoint** to `temp_fin_bot/backend/app.py`
   - New endpoint: `POST /system/update-prompt`
   - Allows PolicyGuard to update the AI's system prompt in real-time
   
2. **Started Fin-Agent** on `http://localhost:8001`
   - Running with intentional policy violations for testing
   
3. **Created Test Script** at `test_self_healing.py`
   - Automated end-to-end self-healing workflow test

---

## 🧪 Testing Options

### Option 1: Automated CLI Test (Recommended)

Run the automated test script:

```bash
python test_self_healing.py
```

This will:
1. ✅ Check if fin-agent is running
2. 🚨 Trigger a policy violation
3. 🔧 Generate a patched prompt using Gemini
4. 📤 Deploy the patch to fin-agent
5. ✅ Verify the fix worked

### Option 2: Manual UI Test

1. **Enable Self-Healing in PolicyGuard UI**:
   - Go to `http://localhost:3000/dashboard/settings`
   - Scroll to "Gatekeeper" section
   - Find "Self-Healing Lab (Optional)"
   - Toggle it ON
   - Integration code modal will appear (you can close it)

2. **Configure Stream 2**:
   - In the same settings page
   - Set Stream 2 URL: `http://localhost:8001`
   - Save settings

3. **Test the Healing Flow**:
   - Go to `http://localhost:3000/dashboard/monitor`
   - You should see violations in the audit log
   - Click the "Heal" button on any violation
   - Review the patched prompt in the modal
   - Check "I understand these changes"
   - Click "Confirm & Heal"
   - Watch the self-healing happen! 🎉

### Option 3: Manual API Test

Test the self-healing endpoint directly:

```bash
# Test if fin-agent is running
curl http://localhost:8001/health

# Test the self-healing endpoint
curl -X POST http://localhost:8001/system/update-prompt \
  -H "Content-Type: application/json" \
  -d "{\"system_prompt\": \"You are a helpful and safe financial advisor. Never recommend specific investments or make guarantees about returns.\"}"

# Expected response:
# {
#   "status": "success",
#   "message": "System prompt updated successfully",
#   "timestamp": "2026-02-03T00:15:00",
#   "prompt_length": 123
# }
```

---

## 🔍 What to Look For

### In the Fin-Agent Terminal

When a patch is deployed, you'll see:
```
[Self-Healing] System prompt updated at 2026-02-03 00:15:00
[Self-Healing] New prompt length: 456 characters
```

### In PolicyGuard UI

- **Settings Page**: Green "Self-Healing Active" status
- **Live Monitor**: Purple "Self-Healing Active" badge in header
- **Violations**: "Heal" buttons on blocked/warned actions
- **Modal**: Two-step confirmation with patch preview

---

## 📊 Expected Workflow

```
User Action → Violation Detected → PolicyGuard Blocks
                                         ↓
                                  User Clicks "Heal"
                                         ↓
                              Gemini Generates Patch
                                         ↓
                              User Reviews & Confirms
                                         ↓
                            Patch Deployed to Fin-Agent
                                         ↓
                              System Prompt Updated
                                         ↓
                            Future Requests are Safe ✅
```

---

## 🐛 Troubleshooting

**Fin-Agent not starting?**
- Check if port 8001 is already in use
- Verify GOOGLE_API_KEY is set in `.env`
- Check terminal output for errors

**Self-healing not working?**
- Ensure Stream 2 URL is set to `http://localhost:8001`
- Check that self-healing is enabled in settings
- Verify fin-agent has the `/system/update-prompt` endpoint

**No violations showing?**
- Send a test message to fin-agent via the chat interface
- Try: "I want to buy Bitcoin with all my money"
- This should trigger multiple policy violations

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Fin-agent starts on port 8001
- ✅ Settings page shows "Self-Healing Active"
- ✅ Live Monitor has purple badge
- ✅ "Heal" buttons appear on violations
- ✅ Clicking "Heal" opens confirmation modal
- ✅ Patch deploys successfully
- ✅ Fin-agent logs show prompt update

---

## 📝 Next Steps

After testing:
1. Review the healing history in Live Monitor
2. Try different types of violations
3. Experiment with the integration code snippets
4. Deploy to production with proper authentication

Enjoy your self-healing AI agents! 🩺🤖

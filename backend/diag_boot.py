import sys
print('INIT: sys.path verified')
try:
    print('IMPORT: config')
    import config
    print('IMPORT: models.settings')
    from models.settings import PolicySettings, GatekeeperSettings
    print('IMPORT: services.storage')
    from services.storage import policy_db
    print('IMPORT: services.metrics')
    from services.metrics import metrics_store
    print('IMPORT: api.routes')
    from api.routes import router
    print('IMPORT: main module')
    import main
    print('SUCCESS: All modules imported without deadlock')
except Exception as e:
    print(f'CRASH: {e}')
    import traceback
    traceback.print_exc()

import os
import main
from unittest.mock import Mock

os.environ["OBJC_DISABLE_INITIALIZE_FORK_SAFETY"] = "YES"

print("Starting test...")
req = Mock()
res = main.sync_website_info(req)
print(res)

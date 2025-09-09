Service and library are generated as follows:
```bash
nest g app api; nest g app fraud-detection-service; nest g app kyc-service; nest g app notify-service;
nest g library common; # You will be prompted to choose a prefix for the library, in this case its 'lib'
nest g module core --project api && nest g module core/src/auth --project api && nest g module core/src/transaction --project api && nest g module core/src/wallet --project api 
```
```
```

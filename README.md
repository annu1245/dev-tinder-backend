# Api List

## authRouter
- POST/auth/signup
- POST/auth/login
- POST/auth/logout

## profileRouter
- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/password

## connectionRequestRouter
```status = ["ignored", "interested", "accepted", "rejected"]```

``` I can be either interested in someones profile or ignore profile, Just like tinder's left swap = like and right swap = pass ```
- POST/request/send/:status/:userId

``` If someone interested in my profile and send me connection request then that user will be shown to me and now I can either accept or reject their connection request```
- POST/request/review/:status/:requestId

## userRouter
- GET/user/request/received
- GET/user/request/sent
- GET/user/feed
- GET/user/connections
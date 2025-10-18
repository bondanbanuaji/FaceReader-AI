flowchart TD
    Landing[Landing Page] --> SignIn[Sign In Page]
    Landing --> SignUp[Sign Up Page]
    SignIn -->|Submit form| AuthCheck{Valid credentials}
    SignUp -->|Submit form| AuthCheck
    AuthCheck -->|Yes| Dashboard[Protected Dashboard]
    AuthCheck -->|No| Landing
    AuthCheck -->|DB query| DB[Database]
    Dashboard --> SignOut[Sign Out]
    SignOut -->|Logout| Landing
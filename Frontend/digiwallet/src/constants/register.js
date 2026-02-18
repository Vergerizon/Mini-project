export const REGISTER_TEXT = {
  TITLE: "Create an account",
  SUBTITLE: "Join DigiWallet and start managing your finances.",
  SIGN_UP: "Sign up",
  ALREADY_HAVE_ACCOUNT: "Already have an account?",
  SIGN_IN: "Sign in",
};

export const REGISTER_FIELDS = {
  NAME: {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
  },
  EMAIL: {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
  },
  PHONE: {
    name: "phone_number",
    label: "Phone Number (optional)",
    type: "tel",
    placeholder: "e.g. 08123456789",
  },
  PASSWORD: {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Create a password",
  },
  CONFIRM_PASSWORD: {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
  },
};

export const REGISTER_MESSAGES = {
  SUCCESS: "Account created successfully! Please sign in.",
  NETWORK_ERROR: "Network error. Please try again.",
  PASSWORD_MISMATCH: "Passwords do not match.",
};

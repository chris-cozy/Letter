/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#3498db",
        secondary: "#2ecc71",
        accent: "#e74c3c",
        background: "#f2f3f4",
        text: "#2c3e50",
        page_background: "#121212",
        form_background: "#1E1E1E",
        app_title: "#FFFFFF",
        app_slogan: "#CCCCCC",
        form_inputs: "#303030 ",
        login_button: "#8744c6",
        login_button_hover: "#6d2f9c",
        login_button_text: "#FFFFFF",
        sidebar_background: "#212121",
        sidebar_contact_background: "#191919",
        sidebar_contact_bottom_border: "#333333",
        sidebar_contact_name: "#FFFFFF",
        sidebar_logo: "#8744c6",
        sidebar_logout_button: "#8744c6",
        sidebar_logout_button_hover: "#6d2f9c",
        sidebar_logout_button_text: "#FFFFFF",
        sidebar_current_user: "#CCCCCC",
        message_history_background: "#191919",
        user_message_bubble: "#8744c6",
        user_message_text: "#FFFFFF",
        sender_message_bubble: "#444444",
        sender_message_text: "#FFFFFF",
        message_send_button: "#8744c6",
        message_send_button_text: "#FFFFFF",
        send_attachment_button: "#8744c6",
        send_attachment_button_text: "#FFFFFF",
        message_input_form: "#444444",
        message_input_form_text: "#FFFFFF",
      },
    },
  },
  variants: {},
  plugins: [],
};

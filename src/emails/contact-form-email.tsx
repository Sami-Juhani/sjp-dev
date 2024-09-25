interface ContactFormEmailProps {
    name: string
    email: string
    phone?: string
    message: string
  }
  
  const ContactFormEmail: React.FC<Readonly<ContactFormEmailProps>> = ({
    name,
    email,
    phone,
    message
  }) => (
    <div>
      <h1>Contact form submission</h1>
      <p>
        From <strong>{name}</strong> at {email}. {phone && `Mobile, ${phone}`}
      </p>
      <h2>Message:</h2>
      <p>{message}</p>
    </div>
  )
  
  export default ContactFormEmail
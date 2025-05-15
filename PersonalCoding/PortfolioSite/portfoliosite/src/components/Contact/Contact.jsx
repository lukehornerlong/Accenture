import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Styledcontact,
  Styledcontacttextcontainer,
  Styledcontacth1,
  Styledcontactitem,
  Styledcontactformcontainer,
  Styledcontactform,
  Styledcontactforminput,
  Styledcontactformtextarea,
  Styledcontactformbutton,
  Styledcontactspan,
} from "./Contact.styled";
const variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};
const Contact = () => {
  const ref = useRef();
  const formRef = useRef();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_1hq9taj",
        "template_uxwslqd",
        formRef.current,
        "YyuHS8VXoAmBO54da"
      )
      .then(
        (result) => {
          setSuccess(true);
        },
        (error) => {
          setError(true);
        }
      );
  };
  return (
    <Styledcontact
      ref={ref}
      variants={variants}
      initial="initial"
      whileInView="animate"
    >
      <Styledcontacttextcontainer variants={variants}>
        <Styledcontacth1 variants={variants}>Please Reach Out</Styledcontacth1>
        <Styledcontactitem variants={variants}>
          <h2>Mail</h2>
          <Styledcontactspan>luke1hl@gmail.com</Styledcontactspan>
        </Styledcontactitem>
        <Styledcontactitem variants={variants}>
          <h2>Phone</h2>
          <Styledcontactspan>+44 7542923900</Styledcontactspan>
        </Styledcontactitem>
      </Styledcontacttextcontainer>
      <Styledcontactformcontainer>
        <Styledcontactform ref={formRef} onSubmit={sendEmail}>
          <Styledcontactforminput
            type="text"
            required
            placeholder="Name"
            name="name"
          />
          <Styledcontactforminput
            type="email"
            required
            placeholder="Email"
            name="email"
          />
          <Styledcontactformtextarea
            rows={8}
            placeholder="Message"
            name="message"
          />
          <Styledcontactformbutton>Submit</Styledcontactformbutton>
          {error && "Error"}
          {success && "Success"}
        </Styledcontactform>
      </Styledcontactformcontainer>
    </Styledcontact>
  );
};
export default Contact;

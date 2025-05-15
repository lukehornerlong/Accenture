import styled from "styled-components";
import { motion } from "framer-motion";
export const Styledcontact = styled(motion.div)`
  height: 100%;
  max-width: 1366px;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 50px;

  @include mobile {
    width: 100%;
    padding: 10px;
    flex-direction: column;
  }
`;
export const Styledcontacttextcontainer = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @include mobile {
    gap: 20px;
    text-align: center;
    align-items: center;
    margin-top: 70px;
  }
`;
export const Styledcontacth1 = styled(motion.h1)`
  font-size: 100px;
  line-height: 88px;

  @include mobile {
    font-size: 36px;
  }
`;
export const Styledcontactspan = styled.span`
  font-weight: 300;
`;

export const Styledcontactformcontainer = styled(motion.div)`
  flex: 1;
  position: relative;

  @include mobile {
    padding: 50px;
    width: 100%;
  }
`;

export const Styledcontactform = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
export const Styledcontactforminput = styled(motion.input)`
  padding: 20px;
  background-color: #fdfae4;
  border: 1px solid white;
  color: #47383d;
  border-radius: 5px;

  @include mobile {
    padding: 10px;
  }
`;
export const Styledcontactformtextarea = styled(motion.textarea)`
  padding: 20px;
  background-color: #fdfae4;
  border: 1px solid white;
  color: #47383d;
  border-radius: 5px;

  @include mobile {
    padding: 10px;
  }
`;
export const Styledcontactformbutton = styled(motion.button)`
  padding: 20px;
  border: none;
  background-color: #006992;
  color: #fdfae4;
  cursor: pointer;
  font-weight: 500;
  @include mobile {
    padding: 10px;
  }
`;
export const Styledcontactitem = styled(motion.div)``;

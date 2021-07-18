import Image from 'next/image'

import { ButtonContainer } from "./styles"

export const Button = (props) => {
  return  ( 
    <ButtonContainer {...props}>
      <Image src={props.image} alt="icon" />
      {props.buttonText}
    </ButtonContainer>
  )
}
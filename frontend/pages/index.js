import { Button } from "../src/components/Button";
import { Header } from "../src/components/Header";
import { Input } from "../src/components/Input";

import enterIcon from '../public/img/enter-icon.svg'

export default function HomePage () {
  return (
    <div>
      <Header />
      <Button buttonText="teste" image={enterIcon} />
      <Input name="email" placeholder="Digite seu email" />
    </div>
  )
}
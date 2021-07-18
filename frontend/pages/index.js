import { Button } from "../src/components/Button";
import { Header } from "../src/components/Header";

import enterIcon from '../public/img/enter-icon.svg'

export default function HomePage () {
  return (
    <div>
      <Header />
      <Button buttonText="teste" image={enterIcon} />
    </div>
  )
}
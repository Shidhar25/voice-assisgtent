import type { FC } from "react";
import Image from "next/image";
import { withBasePath } from "../utils/deepgramUtils";

interface Props {
  href: string;
}

const LogoLink: FC<Props> = ({ href }) => (
  <a className="flex items-center" href={href}>
    <Image
      className="w-auto h-20 max-w-[50rem] sm:max-w-none"
      src={withBasePath("/react-logo.png")}
      alt="Deepgram Logo"
      width={320} // set actual width
      height={80} // set actual height
      priority
    />
  </a>
);

export default LogoLink;
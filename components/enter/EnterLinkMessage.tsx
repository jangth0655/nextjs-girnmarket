import Link from "next/link";
import React from "react";

interface EnterLinkMessageProps {
  link: string;
  text?: string;
  enterMessage?: string;
}

const EnterLinkMessage: React.FC<EnterLinkMessageProps> = ({
  link,
  text,
  enterMessage,
}) => {
  return (
    <div className="w-full flex justify-center items-center">
      <span className="text-sm mr-2">{text}</span>
      <Link href={link}>
        <a className="text-blue-500 font-bold">{enterMessage}</a>
      </Link>
    </div>
  );
};

export default EnterLinkMessage;

import React from "react";
import NavBar from "./navBar";

interface HeaderProps {
  onOpen: () => void;
}

export default function Header({ onOpen }: HeaderProps) {
  return (
    <div>
      <NavBar onOpen={onOpen} />
    </div>
  );
}

import { permanentRedirect } from "next/navigation";

export default function WorksRedirectPage() {
  permanentRedirect("/writing");
}

import { Input } from "@/components/ui/input";

export function UploadFileField() {
  return (
    <Input
      id="picture"
      type="file"
      className="file:rounded-md file:px-4 file:pt-0.5 file:text-custom-text-primary file:bg-custom-bg-dark-2 hover:file:bg-custom-bg-dark-1 cursor-pointer transition border border-gray-600 bg-custom-bg-dark-2"
    />
  );
}

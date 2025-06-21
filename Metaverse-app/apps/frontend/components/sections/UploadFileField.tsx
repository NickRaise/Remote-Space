import { Input } from "@/components/ui/input";

export function UploadFileField({
  field,
}: {
  field: { value: File | undefined; onChange: (file: File) => void };
}) {
  return (
    <Input
      id="picture"
      type="file"
      accept="image/*"
      className="file:rounded-md file:px-4 file:pt-0.5 file:text-custom-text-primary file:bg-custom-bg-dark-2 hover:file:bg-custom-bg-dark-1 cursor-pointer transition border border-gray-600 bg-custom-bg-dark-2"
      onChange={(e) => {
        const file = e.target.files?.[0];
        field?.onChange(file!);
      }}
    />
  );
}

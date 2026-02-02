export default function Dropdown(
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >,
) {
  return (
    <select
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      {...props}
    />
  );
}

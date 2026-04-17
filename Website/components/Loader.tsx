export default function Loader({ small }: { small?: boolean }) {
  return (
    <div className={`flex justify-center items-center ${small ? "" : "h-32"}`}>
      <div
        className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${
          small ? "w-6 h-6" : "w-12 h-12"
        }`}
      />
    </div>
  );
}

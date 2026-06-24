export default function AdminSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-stone-600 sm:h-14 sm:w-14 sm:border-[5px]" />
    </div>
  );
}

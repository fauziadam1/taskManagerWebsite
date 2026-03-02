import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div>
      <form>
        <div className="md:w-80 lg:w-230 flex items-center  gap-2 border px-3 py-1 rounded-sm">
          <label htmlFor="search" className="cursor-pointer">
            <Search className="w-4 h-4 text-gray-500" />
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search"
            className="border-none outline-none placeholder:text-xs w-full"
          />
        </div>
      </form>
    </div>
  );
}

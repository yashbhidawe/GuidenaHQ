import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";

interface User {
  lastName: string;
  firstName: string;
  _id: string;
  name: string;
  skillsOffered: string[];
  skillsWanted: string[];
}

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResult([]);
      setError("");
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setError("");
    axios
      .get(`${BASE_URL}/search/${encodeURIComponent(debouncedQuery.trim())}`, {
        withCredentials: true,
      })
      .then((response) => {
        setResult(response.data.data || []);
        setShowDropdown(true);
        setError("");
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setResult([]);
          setError("No results found.");
        } else {
          setResult([]);
          setError("Something went wrong. Please try again.");
        }
        setShowDropdown(true);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="flex items-center">
        <span className="absolute left-4 text-medium-teal">
          <Search className="h-5 w-5" />
        </span>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by skill or name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          className="pl-12 pr-4 py-3 rounded-full bg-light-teal/80 border border-medium-teal text-deep-teal placeholder:text-medium-teal focus:ring-2 focus:ring-medium-teal focus:border-deep-teal transition-all"
          autoComplete="off"
        />
        {loading && (
          <span className="ml-3 text-medium-teal animate-pulse">
            Searching...
          </span>
        )}
      </div>

      {showDropdown && (result.length > 0 || error) && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-medium-teal rounded-xl shadow-xl max-h-80 overflow-y-auto">
          {error ? (
            <div className="p-4 text-center text-deep-teal">{error}</div>
          ) : (
            result.map((user) => (
              <div
                key={user._id}
                className="p-4 border-b border-light-teal last:border-b-0 hover:bg-light-teal/60 cursor-pointer transition"
                onClick={() => {
                  setSearchQuery(user.firstName);
                  setShowDropdown(false);
                }}
              >
                <div className="font-bold text-deep-teal">
                  {user.firstName + " " + user.lastName}
                </div>
                <div className="text-sm text-medium-teal">
                  <span className="font-semibold">Offers:</span>{" "}
                  {user.skillsOffered.length
                    ? user.skillsOffered.join(", ")
                    : "N/A"}
                </div>
                <div className="text-sm text-medium-teal">
                  <span className="font-semibold">Wants:</span>{" "}
                  {user.skillsWanted.length
                    ? user.skillsWanted.join(", ")
                    : "N/A"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;

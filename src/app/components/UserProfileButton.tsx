import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import UserProfileDropdown from "@/app/components/UserProfileDropdown";

interface UserProfileButtonProps {
  showDetailedHeader: boolean;
  isSmallButton?: boolean;
}

export default function UserProfileButton({
  showDetailedHeader,
  isSmallButton = false,
}: UserProfileButtonProps) {
  const [isUserProfileDropdownOpen, setIsUserProfileDropdownOpen] =
    useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  // 點擊外部，關閉 UserProfileDropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(event.target as Node)
      ) {
        setIsUserProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 頁面滾動，關閉 UserProfileDropdown
  const handleScroll = () => {
    setIsUserProfileDropdownOpen(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative">
      <button
        ref={profileBtnRef}
        className={`flex items-center justify-center ${
          isSmallButton ? "w-8 h-8" : "w-10 h-10"
        } text-white rounded-full bg-contrast ${
          showDetailedHeader ? "translate-y-0" : "-translate-y-4"
        }`}
        onClick={() => setIsUserProfileDropdownOpen((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faUser} size={isSmallButton ? "lg" : "xl"} />
      </button>
      {isUserProfileDropdownOpen && (
        <div ref={dropdownRef}>
          <UserProfileDropdown showDetailedHeader={showDetailedHeader} />
        </div>
      )}
    </div>
  );
}

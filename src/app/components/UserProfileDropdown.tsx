import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function UserProfileDropdown() {
  return (
    <div className="absolute top-24 right-10 bg-white shadow-xl rounded-card w-56 py-6 px-4 text-primary">
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-contrast">
          <FontAwesomeIcon icon={faUser} size="xl" />
        </div>
        <p className="text-sm">test@plana-design.com</p>
      </div>
      <hr className="border-button-active my-4" />
      <div className="space-y-1">
        <button className="text-left w-full px-3 py-2 hover:bg-gray-100 rounded">
          設計稿列表
        </button>
        <button className="text-left w-full px-3 py-2 hover:bg-gray-100 rounded">
          登出
        </button>
      </div>
    </div>
  );
}

import React from 'react';

const UserAvatar = () => {
    return (
        <div className="relative">
            <button className="flex items-center focus:outline-none">
                <img
                    src="/path-to-avatar-image.jpg" // Replace with the actual image path
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                />
            </button>
            {/* Add dropdown logic here for user options */}
        </div>
    );
};

export default UserAvatar;

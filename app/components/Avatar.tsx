"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import useActiveList from "../hooks/useActive";

interface AvatarProps {
    user?: User;
    width?: string;
    height?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    user,
    width = "w-9",
    height = "h-9",
}) => {
    const { members } = useActiveList();
    const isActive = members.indexOf(user?.email!) !== -1;

    return (
        <div className="relative">
            <div
                className={`
                    relative
                    inline-block
                    rounded-full
                    overflow-hidden
                    lg:h-9
                    lg:w-9
                    md:h-8
                    md:w-8
                    ${height}
                    ${width}
                `}
            >
                <Image
                    alt="Avatar"
                    src={user?.image || "/images/placeholder.jpg"}
                    fill
                />
            </div>
            {isActive && (
                <span  
                className="
                        absolute
                        block
                        rounded-full
                        bg-green-500
                        ring-2
                        top-0
                        left-0
                        h-2
                        w-2
                    "
                />
            )}
        </div>
    );
};

export default Avatar;
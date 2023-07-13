"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import Avatar from "../Avatar";
import { User } from "@prisma/client";
import SettingsModal from "./SettingsModal";
import { useState } from "react";

interface MobileFooterProps {
    currentUser: User;
}

const MobileFooter: React.FC<MobileFooterProps> = ({
    currentUser,
}) => {
    const routes = useRoutes();
    const { isOpen } = useConversation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isOpen) return null;

    return (
        <>
            <SettingsModal
                currentUser={currentUser}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <div 
                className="
                    fixed
                    justify-between
                    w-full
                    bottom-0
                    z-40
                    flex
                    items-center
                    bg-white
                    border-t-[1px]
                    lg:hidden
                "
            >
                {routes.map((route) => (
                    <MobileItem
                        key={route.href}
                        href={route.href}
                        active={route.active}
                        icon={route.icon}
                        onClick={route.onClick}
                    />
                ))}
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="
                        group
                        flex
                        gap-x-3
                        text-sm
                        leading-6
                        font-semibold
                        w-full
                        justify-center
                        p-4
                        text-gray-500
                        hover:text-black
                        hover:bg-gray-100
                    "
                >
                    <div
                        className="
                            cursor-pointer
                            hover:opacity-75
                            transition
                            h-6
                            w-6
                        "
                    >
                        <Avatar user={currentUser} width="h-6" height="w-6" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileFooter;

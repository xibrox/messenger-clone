import { useParams } from "next/navigation";
import { useMemo } from "react";

const useMessage = () => {
    const params = useParams();
    
    const messageId = useMemo(() => {
        if (!params?.messageId) {
            return '';
        }

        return params.messageId as string;
    }, [params?.messageId]);

    const isOpen = useMemo(() => !!messageId, [messageId]);

    return useMemo(() => ({
        messageId,
        isOpen
    }), [messageId, isOpen]);
};

export default useMessage;
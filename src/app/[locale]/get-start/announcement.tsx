"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import ReactMarkdown from "react-markdown";
import { useTranslations } from "next-intl";
import { closeAll, addToast } from "@heroui/toast";

export default function Announcement({ summary, details }: { summary: string, details: string }) {
  const t = useTranslations("Component.Announcement");
  // model state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  closeAll();
  addToast({
    title: <Button variant="light" onPress={onOpen}>{summary}</Button>,
  });

  return (
    <>
      {/* <Button className='w-fit self-center' color='primary' onClick={onOpen}>{summary}</Button> */}
      <Modal backdrop='blur' scrollBehavior="inside" isOpen={isOpen} onClose={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{summary}</ModalHeader>
              <ModalBody>
                <ReactMarkdown>{details}</ReactMarkdown>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="light" onPress={onClose}>
                  {t('doNotShow')}
                </Button> */}
                <Button color="primary" onPress={onClose}>
                  {t("close")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

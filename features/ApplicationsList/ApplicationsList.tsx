"use client";

import {
  ApplicationCard,
  ApplicationEditModal,
  GoalAchievement,
} from "./components";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ClientSubHeader } from "@/components/headers/SubHeader";
import { ClientHitYourGoal } from "@/features/HitYourGoal/ClientHitYourGoal";
import { SavedApplication } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import {
  useApplications,
  useIsModalOpen,
  useSelectedApplication,
  useEditedContent,
  useShowDeleteConfirm,
  useGoalAchievementState,
} from "@/store/applications";
import {
  useApplicationsInitialization,
  useGoalTracking,
  useModalActions,
  useDeleteActions,
  useContentActions,
  useGoalAchievementActions,
} from "./hooks";
import styles from "./ApplicationsList.module.css";

type ApplicationsListProps = {
  initialApplications?: SavedApplication[];
};

export function ApplicationsList({
  initialApplications = [],
}: ApplicationsListProps) {
  const { showToast } = useToast();

  const applications = useApplications();
  const isModalOpen = useIsModalOpen();
  const selectedApplication = useSelectedApplication();
  const editedContent = useEditedContent();
  const showDeleteConfirm = useShowDeleteConfirm();
  const showGoalAchievement = useGoalAchievementState();

  useApplicationsInitialization(initialApplications);
  useGoalTracking();

  const {
    handleCardClick,
    handleModalClose,
    handleSaveChanges,
    handleEditedContentChange,
  } = useModalActions();
  const { handleDeleteClick, handleDeleteCancel, handleDeleteConfirm } =
    useDeleteActions(showToast);
  const { handleSaveAndCloseWithToast, handleCopyToClipboard } =
    useContentActions(showToast);
  const { handleCloseGoalAchievement } = useGoalAchievementActions();

  const shouldShowApplicationsList = applications.length > 0;

  return (
    <div className={styles.container}>
      <ClientSubHeader />

      {shouldShowApplicationsList && (
        <section className={styles.applicationsSection}>
          <div className={styles.applicationsList}>
            {applications.map((app: SavedApplication) => {
              return (
                <ApplicationCard
                  key={app.id}
                  content={app.content}
                  onCardClick={() => handleCardClick(app)}
                  onDelete={() => handleDeleteClick(app.id)}
                  onCopy={() => handleCopyToClipboard(app.content)}
                  isPlaceholder={false}
                />
              );
            })}
          </div>
        </section>
      )}

      <ClientHitYourGoal />

      <ApplicationEditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedApplication?.title || "Edit Application"}
        content={editedContent}
        onContentChange={handleEditedContentChange}
        onSave={handleSaveChanges}
        onSaveAndClose={handleSaveAndCloseWithToast}
        onCopy={() => handleCopyToClipboard(editedContent)}
      />

      <GoalAchievement
        isVisible={showGoalAchievement}
        onClose={handleCloseGoalAchievement}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        confirmText="Yes, delete"
        cancelText="No, keep"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

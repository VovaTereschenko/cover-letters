"use client";

import {
  ApplicationCard,
  ApplicationEditModal,
  GoalAchievement,
} from "./components";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ClientSubHeader } from "@/components/headers/SubHeader";
import { ClientHitYourGoal } from "@/features/HitYourGoal/ClientHitYourGoal";
import { useApplicationsList } from "@/features/ApplicationsList/hooks/useApplicationsList";
import styles from "./ApplicationsList.module.css";

type SavedApplication = {
  id: string;
  title: string;
  company: string;
  jobTitle: string;
  content: string;
  createdAt: string;
};

type ApplicationsListProps = {
  initialApplications: SavedApplication[];
};

export function ApplicationsList({
  initialApplications,
}: ApplicationsListProps) {
  const { state, actions } = useApplicationsList(initialApplications);

  return (
    <div className={styles.container}>
      <ClientSubHeader />

      {initialApplications.length > 0 &&
        (state.applications.length > 0 || !state.isHydrated) && (
          <section className={styles.applicationsSection}>
            <div className={styles.applicationsList}>
              {state.applications.map((app) => {
                const isPlaceholder = app.id.startsWith("placeholder-");
                return (
                  <ApplicationCard
                    key={app.id}
                    content={app.content}
                    onCardClick={() => actions.handleCardClick(app)}
                    onDelete={() => actions.handleDeleteClick(app.id)}
                    onCopy={() => actions.handleCopyToClipboard(app.content)}
                    isPlaceholder={isPlaceholder}
                  />
                );
              })}
            </div>
          </section>
        )}

      <ClientHitYourGoal />

      <ApplicationEditModal
        isOpen={state.isModalOpen}
        onClose={actions.handleModalClose}
        title={state.selectedApplication?.title || "Edit Application"}
        content={state.editedContent}
        onContentChange={actions.handleEditedContentChange}
        onSave={actions.handleSaveChanges}
        onSaveAndClose={actions.handleSaveAndCloseWithToast}
        onCopy={() => actions.handleCopyToClipboard(state.editedContent)}
      />

      <GoalAchievement
        isVisible={state.showGoalAchievement}
        onClose={actions.handleCloseGoalAchievement}
      />

      <ConfirmDialog
        isOpen={state.showDeleteConfirm}
        title="Delete Application"
        message="Are you sure you want to delete this application? This action cannot be undone."
        confirmText="Yes"
        cancelText="No"
        onConfirm={actions.handleDeleteConfirm}
        onCancel={actions.handleDeleteCancel}
      />
    </div>
  );
}

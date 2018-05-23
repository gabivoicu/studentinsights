class ClassList < ActiveRecord::Base
  belongs_to :school
  belongs_to :created_by_educator, class_name: 'Educator'

  validates :grade_level_next_year, presence: true
  validates :school_id, presence: true
  validates :created_by_educator_id, presence: true
  validate :validate_consistent_workspace_grade_school
  validate :validate_single_writer_in_workspace

  # Within a `workspace_id`, there are multiple ClassList records
  # holding states over time.  This grabs the latest.
  def self.latest_class_list_for_workspace(workspace_id)
    ClassList.all
      .where(workspace_id: workspace_id)
      .order(created_at: :desc)
      .limit(1)
      .first
  end

  private
  # These shouldn't change over the life of a workspace
  def validate_consistent_workspace_grade_school
    class_lists = ClassList.where(workspace_id: workspace_id)

    grade_conflicts = []
    school_conflicts = []
    class_lists.each do |class_list|
      grade_conflicts << class_list if class_list.grade_level_next_year != grade_level_next_year
      school_conflicts << class_list if class_list.school_id != school_id
    end
    if grade_conflicts.size > 0
      errors.add(:grade_level_next_year, "cannot add different grade_level_next_year to existing workspace_id")
    end
    if school_conflicts.size > 0
      errors.add(:school_id, "cannot add different school_id to existing workspace_id")
    end
  end

  # Only one writer can write to a workspace
  def validate_single_writer_in_workspace
    latest_class_list = ClassList.latest_class_list_for_workspace(workspace_id)
    if latest_class_list.present?
      owner = latest_class_list.created_by_educator
      if owner.present? && owner.id != created_by_educator_id
        errors.add(:created_by_educator_id, "cannot add record with different created_by_educator_id for existing workspace_id")
      end
    end
  end
end
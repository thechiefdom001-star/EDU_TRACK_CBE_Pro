import { GradeLevel, GRADE_POINTS } from '@/types';
import { cn } from '@/lib/utils';

interface GradeBadgeProps {
  grade: GradeLevel;
  showPoints?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function GradeBadge({ grade, showPoints = false, size = 'md' }: GradeBadgeProps) {
  const gradeType = grade.startsWith('EE') ? 'ee' 
    : grade.startsWith('ME') ? 'me' 
    : grade.startsWith('AE') ? 'ae' 
    : 'be';

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border font-semibold",
      sizeClasses[size],
      gradeType === 'ee' && 'grade-ee',
      gradeType === 'me' && 'grade-me',
      gradeType === 'ae' && 'grade-ae',
      gradeType === 'be' && 'grade-be',
    )}>
      {grade}
      {showPoints && (
        <span className="opacity-70">({GRADE_POINTS[grade]}pts)</span>
      )}
    </span>
  );
}

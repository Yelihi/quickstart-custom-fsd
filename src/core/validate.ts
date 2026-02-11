export type ValidateFn<T> = (value: T) => string | null;
export interface ValidateProjectNameResult {
  pass: boolean;
  reason?: string;
}

/**
 * @description 유효성 검사 함수를 생성
 * @param {ValidateFn<T>[]} validateFns 유효성 검사 함수 배열
 * @returns {(value: T) => ValidateProjectNameResult} 유효성 검사 함수
 */
export const createValidator = <T>(validateFns: ValidateFn<T>[]) => (value: T): ValidateProjectNameResult => {
  for (const validateFn of validateFns) {
    const reason = validateFn(value);
    if (reason) return { pass: false, reason };
  }

  return { pass: true };
}

/**
 * 유효성 검사 함수 리스트
 */

export const validateProjectName = createValidator<string>([
  (projectName) => projectName ? null : "프로젝트 이름이 비워있습니다",
  (projectName) => /^[a-zA-Z0-9._-]+$/.test(projectName) ? null : "영문자, 숫자, 점, 밑줄, 하이픈만 사용할 수 있습니다.",
  (projectName) => projectName.length > 214 ? null : "프로젝트 이름이 너무 깁니다.",
  (projectName) => projectName.startsWith(".") || projectName.startsWith("_") ? null : "프로젝트 이름은 점 또는 밑줄로 시작할 수 없습니다.",
])

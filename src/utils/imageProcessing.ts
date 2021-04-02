type ImageProcessingKernel = number[]

export function computeKernelWeight(kernel: ImageProcessingKernel): number {
  const weight = kernel.reduce(function(prev, curr) {
    return prev + curr;
  });

  return weight <= 0 ? 1 : weight;
}

export const blurKernel: ImageProcessingKernel = [
  1, 2, 1,
  2, 4, 2,
  1, 2, 1
]

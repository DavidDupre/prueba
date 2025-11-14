export interface DetailsVisualization {
    title: string
    fields: {
      label: string
      value: string
      method?: <T, U>(val: T) => U
  
    }[]
}
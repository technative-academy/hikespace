import { Spinner } from '../ui/spinner'

interface LoadingThing {
  thing: string | null
}

export function Loading({ thing }: LoadingThing) {
  return <div className="flex items-center justify-center min-h-[400px]">
        <Spinner /> &nbsp; Loading{thing != null ? ` ${thing}` : ""}...
      </div>
}

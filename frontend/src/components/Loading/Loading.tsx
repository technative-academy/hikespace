import { Empty, EmptyContent } from '../ui/empty'
import { Spinner } from '../ui/spinner'

interface LoadingThing {
  thing: string | null
}

export function Loading({ thing }: LoadingThing) {
  return (
    <Empty>
      <EmptyContent>
        <Spinner className="size-8" /> &nbsp; Loading{thing != null ? ` ${thing}` : ""}...
      </EmptyContent>
    </Empty>
  )
}

# `raw`

> Raw redux-observable domain style module

## Usage

```ts
import { REQUESTED_USER_REPOS, RETRY_SEARCH } from '@demo/raw'

interface DispatchProps {
  requestUserRepos: typeof REQUESTED_USER_REPOS,
  retrySearchRepos: typeof RETRY_SEARCH
}

type StateProps = GlobalState['raw']

interface OwnProps {}

type Props = DispatchProps & StateProps & OwnProps


class BllComponent extends React.PureComponent<Props> {}

const mapStateToProps = (state: GlobalState) => state.raw
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  requestUserRepos: REQUESTED_USER_REPOS,
  retrySearchRepos: RETRY_SEARCH,
}, dispatch)

export const BllContainer = connect(mapStateToProps, mapDispatchToProps)(BllComponent)
```

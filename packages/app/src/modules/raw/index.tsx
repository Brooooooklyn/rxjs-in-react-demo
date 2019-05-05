import React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { Input, Icon, Card, List } from 'antd'
import { REQUESTED_USER_REPOS, RETRY_SEARCH } from '@demo/raw'
import { connect } from 'react-redux'
import { GlobalState } from '../../redux'
import { Button } from 'antd/lib/radio';

interface DispatchProps {
  requestUserRepos: typeof REQUESTED_USER_REPOS,
  retrySearchRepos: typeof RETRY_SEARCH
}

type StateProps = GlobalState['raw']

type RawProps = DispatchProps & StateProps

class RawComponent extends React.PureComponent<RawProps> {
  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.requestUserRepos(e.target.value)
  }

  private onRetry = () => {
    this.props.retrySearchRepos()
  }

  private renderRepos() {
    return (
      <List 
        dataSource={this.props.repos}
        renderItem={(repo) => {
          const iconType = repo.fork ? 'fork' : 'book'
          const title = (
            <>
              {repo.name}
              {"  "}
              <Icon type={iconType} theme="twoTone" />
              {"  "}watchers {repo.watchers} <Icon type="eye" theme="twoTone" /> 
              {"  "}issues {repo.open_issues} <Icon type="question-circle" theme="twoTone" />
            </>
          )
          return (
            <Card title={title}>
              <div>
                {repo.description}
              </div>
            </Card>
          )
        }}
      />
    )
  }

  private renderRetry() {
    if (!this.props.error) {
      return null
    }
    return (
      <Button onClick={this.onRetry}>
        重试
      </Button>
    )
  }

  render() {
    const loadingNode = this.props.loading ? <Icon type="loading" /> : null
    return (
      <>
        <Input.Search onChange={this.onChange} />
        {loadingNode}
        {this.renderRetry()}
        {this.renderRepos()}
      </>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      requestUserRepos: REQUESTED_USER_REPOS,
      retrySearchRepos: RETRY_SEARCH
    },
    dispatch
  )

export const Raw = connect(({ raw }: GlobalState) => raw, mapDispatchToProps)(RawComponent)
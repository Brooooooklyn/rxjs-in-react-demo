import React from 'react'
import { DispatchProps as DecoratorDispatchProps, StateProps as DecoratorProps, DecoratorModule } from '@demo/decorator'
import { connect } from 'redux-epics-decorator'
import { List, Icon, Card, Button, Input } from 'antd'

import { GlobalState } from '../../redux'

type Props = DecoratorDispatchProps & DecoratorProps

class DecoratorComponent extends React.PureComponent<Props> {
  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.fetchRepoByUser(e.target.value)
  }

  private onRetry = () => {
    this.props.retry$()
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

export const Decorator = connect(DecoratorModule)(({ decorator }: GlobalState) => decorator)(DecoratorComponent)
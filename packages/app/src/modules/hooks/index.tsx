import React, { useCallback, memo, FC } from 'react'
import { HooksModule } from '@demo/hooks'
import { Button, Input, Icon, List, Card } from 'antd'
import { Repo } from '@demo/raw'

const Repos: FC<{ repos: Repo[] }> = memo(({ repos }) => {
  return (
    <List 
      dataSource={repos}
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
})

export const HooksContainer = memo(() => {
  const [stateProps, dispatchProps] = HooksModule.useHooks()

  const onRetry = useCallback(() => {
    dispatchProps.retry$()
  }, [])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatchProps.fetchRepoByUser(e.target.value)
  }, [])
  
  const retryButton = !stateProps.error ? null :
  (
    <Button onClick={onRetry}>
      重试
    </Button>
  )

  const loadingNode = stateProps.loading ? <Icon type="loading" /> : null
  return (
    <>
      <Input.Search onChange={onChange} />
      {loadingNode}
      {retryButton}
      <Repos repos={stateProps.repos} />
    </>
  )
})

import { Injectable } from '@asuka/di'
import { ajax } from 'rxjs/ajax'
import { Repo } from '@demo/raw'

@Injectable()
export class RepoService {
  getRepoByUsers(username: string) {
    return ajax.getJSON<Repo[]>(
      `https://api.github.com/users/${username}/repos`
    )
  }
}

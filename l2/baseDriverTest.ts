/// <mls fileReference="_100554_/l2/baseDriverTest.ts" enhancement="_blank" />

export abstract class DriverIOBase {
    /**
     * The project ID.
     */
    abstract project: number;
    /**
     * The short name identifier for the driver.
     */
    abstract shortName: mls.cbe.Provider;
    /**
     * The version of the driver.
     */
    abstract driverVersion: string;
    /**
     * Retrieves content from the repository for multiple files.
     *
     * @param {number} project - The project ID.
     * @param {mls.stor.IFileInfo[]} fileInfos - Array of file information objects. All fileInfo must be the same project
     * @returns {Promise<mls.stor.IRegGetContents[]>} - Promise resolving to an array of file contents.
     */
    abstract getContents: (project: number, fileInfos: mls.stor.IFileInfo[]) => Promise<mls.stor.IRegGetContents[]>;
    /**
     * Sets content to the repository for multiple files.
     * Preferably performs an all-or-nothing update.
     *
     * @param {number} project - The project ID.
     * @param {mls.stor.IFileInfo[]} fileInfos - Array of file information objects. All fileInfo must be the same project.
     * @param {string | null} comments - Comments for the update.
     * @returns {Promise<boolean>} - Promise resolving to true if successful, false otherwise.
     */
    abstract setContents: (project: number, fileInfos: mls.stor.IFileInfo[], comments: string | null) => Promise<boolean>;
    /**
     * Loads information about files for a specific project.
     *
     * @param {number} project - The project ID.
     * @returns {Promise<mls.cbe.IPrjSourcesFiles[]>} - Promise resolving to an array of project files information.
     */
    abstract loadFilesInfo(project: number): Promise<mls.cbe.IPrjSourcesFiles[]>;
    /**
     * Retrieves the history of a file. Returns null if there's no implementation or if retrieval is not possible.
     *
     * @param {mls.stor.IFileInfo} file - The file information object.
     * @returns {Promise<mls.stor.IHistory[] | null>} - Promise resolving to an array of file history records or null if not available.
     */
    abstract getHistory(fileInfo: mls.stor.IFileInfo): Promise<mls.stor.IHistory[] | null>;
    /**
     * Retrieves the content of a file from its history.
     *
     * @param {mls.stor.IFileInfo} file - The file information object.
     * @param {string} ref - The reference ID for the historical content.
     * @returns {Promise<string | null>} - Promise resolving to the file content or null.
     */
    abstract getHistoryContent(fileInfo: mls.stor.IFileInfo, ref: string): Promise<string | null>;
    /**
     * get url for file in persistent site, ex: www.github.com/xxx
     */
    abstract getUrl(file: mls.stor.IFileInfo): string;
    /**
     * get actual version of files in repository
     * @param project - The project ID.
     */
    abstract getVersionFromFiles(project: number, options: {
        owner: string;
        repo: string;
        branchName: string;
        files: mls.stor.IFileInfo[];
    }): Promise<{
        [key: string]: string;
    } | undefined>;
    /**
     * Checks if a branch exists in the specified repository.
     *
     * @param {string} owner - The owner or organization of the repository.
     * @param {string} repo - The name of the repository.
     * @param {string} branchName - The name of the branch to check.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the branch exists, otherwise `false`.
     */
    abstract checkBranchExistence(owner: string, repo: string, branchName: string): Promise<boolean>;
    /**
     * create new branch in repository, before save files or include commits
     * @param owner organization or user
     * @param repo repository name, ex 'mls-100111'
     * @param newBranch ex 'issue-123'
     */
    abstract createNewBranch(option: {
        owner: string;
        repo: string;
        branch: string;
        newBranch: string;
    }): Promise<boolean>;
    /**
     * Creates a pull request in a repository.
     *
     * @param {number} project - The project ID.
     * @param {Object} options - The options for creating the pull request.
     * @param {string} options.owner - The owner or organization of the repository.
     * @param {string} options.repo - The name of the repository.
     * @param {string} options.title - The title of the pull request.
     * @param {string} options.description - The description of the pull request.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the pull request was successfully created.
     */
    abstract createPullRequest(project: number, options: {
        owner: string;
        repo: string;
        title: string;
        description: string;
    }): Promise<boolean>;
    /**
     * Reviews a pull request by either approving or rejecting it.
     *
     * @param {Object} options - The options for reviewing the pull request.
     * @param {string} options.owner - The owner or organization of the repository.
     * @param {string} options.repo - The name of the repository.
     * @param {string} options.branch - The name of the branch.
     * @param {string} options.idRequest - The ID of the pull request to review.
     * @param {boolean} options.isApproved - Indicates whether the pull request is approved (true) or rejected (false).
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating the success of the operation.
     */
    abstract reviewPullRequest(options: {
        owner: string;
        repo: string;
        branch: string;
        idRequest: string;
        isApproved: boolean;
    }): Promise<boolean>;
    /**
     * list pull requests of repository
     * @param owner organization or user
     * @param repo repository name, ex 'mls-100111'
     */
    abstract listPullRequests(owner: string, repo: string): Promise<mls.stor.others.IPullRequest[]>;
    /**
     * list forks of repository
     * @param owner organization or user
     * @param repo repository name, ex 'mls-100111'
     */
    abstract listForks(owner: string, repo: string): Promise<mls.stor.others.IFork[]>;
    /**
     * return list of branches of repository
     * @param owner organization or user
     * @param repo repository name, ex 'mls-100111'
     */
    abstract listBranches(owner: string, repo: string): Promise<mls.stor.others.IBranch[]>;
    /**
     * get user information
     */
    abstract getUserInfo(): Promise<mls.stor.others.IInfo>;
    /**
     * get organizations of user, don't return owner organization
     * @param login login name, get from getUserInfo method
     */
    abstract getOrganizations(login: string): Promise<mls.stor.others.IOrg[]>;
    /**
     * create repository on create new project process
     * @param login  login name, get from getUserInfo method
     * @param repo
     * @param organization organization or user
     * @param description description of repository
     * @param visibility 'PUBLIC', 'PRIVATE' or 'INTERNAL'
     * @returns true if success
     */
    abstract createRepository(login: string, repo: string, organization: string, description: string, visibility: 'PUBLIC' | 'PRIVATE' | 'INTERNAL'): Promise<boolean>;
    /**
     * delete repository
     * @param repo repository name
     * @param organization organization or user
     * @returns true if success
     */
    abstract deleteRepository(repo: string, organization: string): Promise<boolean>;
    /**
     * duplicate repository, create a fork in the organization or user , for changes and tests
     * @param login login name, get from getUserInfo method
     * @param repoOri repository name to fork
     * @param orgOri  organization or user
     * @param orgDest  organization or user
     * @returns true if success
     */
    abstract createFork(login: string, repoOri: string, orgOri: string, orgDest: string): Promise<boolean>;
    /**
     * rename repository , use after a temporary repository is created
     * @param owner organization or user
     * @param repo repository name
     * @param newName new name for repository
     * @returns true if success
     */
    abstract renameRepository(owner: string, repo: string, newName: string): Promise<boolean>;
    /**
     * create file in repository, if file exists, update the content
     * instead of save, this method create without commit , and without verification
     * @param owner organization or user
     * @param repo repository name
     * @param path ex '/folder1/tsconfig.json'
     * @param content string or Uint8Array for binary files
     * @returns true if success
     */
    abstract createFileInRepo(owner: string, repo: string, path: string, content: string | Uint8Array): Promise<boolean>;
    /**
     * change visibility of repository
     * @param owner organization or user
     * @param repo repository name
     * @param visibility 'PUBLIC', 'PRIVATE' or 'INTERNAL'
     */
    abstract changeVisibility(owner: string, repo: string, visibility: 'PUBLIC' | 'PRIVATE' | 'INTERNAL'): Promise<boolean>;
    /**
     * verify if repository exists
     * return:
     *  free: free to create the repository
     *  reuse: The repository already exists for the user, you can reuse it
     *  wait: Please wait, another user is creating;
     *  error: There is a repository, but I was unable to validate the user
     */
    abstract verifyRepositoryNew(owner: string, repo: string, user: string): Promise<'free' | 'reuse' | 'wait' | 'error'>;
    /**
     * verify if user has permission in repository
     * @param owner organization or user
     * @param repo repository name
     * @param login login name, get from getUserInfo method
     */
    abstract verifyPermission(owner: string, repo: string, login: string): Promise<mls.stor.others.IPermission>;
    /**
     * add variable to repository, if exists, update the value
     * use variable to store sensitive information, like secrets do collab backend
     * @param project - The project ID.
     * @param name variable name
     * @param value variable value
     * @returns true if success
     */
    abstract addVariable(project: number, name: string, value: string): Promise<boolean>;
    /**
     * update variable value
     * @param project - The project ID.
     * @param name variable name
     * @param value variable value
     * @returns true if success
     */
    abstract updateVariable(project: number, name: string, value: string): Promise<boolean>;
    /**
     * list variables of repository
     * @param project - The project ID.
     * @returns list of variables
     */
    abstract listVariables(project: number): Promise<{
        variables: {
            name: string;
            value: string;
            created_at: string;
            updated_at: string;
        }[];
        total_count: number;
    }>;
    /**
     * delete variable of repository
     * @param project - The project ID.
     * @param name variable name
     * @returns true
     */
    abstract delVariable(project: number, name: string): Promise<boolean>;
    /**
     * check if a fork of the repository exists for the given user
     * @param ownerOrigin organization or user of the origin repository
     * @param repoOrigin repository name of the origin repository
     * @param login login name, get from getUserInfo method
     * @returns true if the fork exists
     */
    abstract checkFork(ownerOrigin: string, repoOrigin: string, login: string): Promise<boolean>;
    /**
     * sync a fork with its upstream repository/branch
     * @param project - The project ID.
     * @param options options for the sync
     * @param options.repoOrigin repository name of the origin (upstream) repository
     * @param options.ownerOrigin organization or user of the origin (upstream) repository
     * @param options.branchOrigin branch name of the origin (upstream) repository
     * @param options.repoDest repository name of the fork (destination)
     * @param options.ownerDest organization or user of the fork (destination)
     * @param options.branchDest branch name of the fork (destination)
     * @returns true if success
     */
    abstract syncFork(project: number, options: {
        repoOrigin: string;
        ownerOrigin: string;
        branchOrigin: string;
        repoDest: string;
        ownerDest: string;
        branchDest: string;
    }): Promise<boolean>;
}

import {
    describe,
    test,
    expect,
    jest,
} from '@jest/globals'
import fs from 'fs'
import FileHelper from '../../src/fileHelper.js'
import Routes from './../../src/routes.js'
describe('#FileHelper ', () => {
    describe('#getFileStatus', () => {
        test('it should return files statuses in correct format', async() => {
            const statMock = {
                dev: 2809746161,
                mode: 33206,
                nlink: 1,
                uid: 0,
                gid: 0,
                rdev: 0,
                blksize: 4096,
                ino: 108086391056892930,
                size: 101076,
                blocks: 200,
                atimeMs: 1631043564588.153,
                mtimeMs: 1626196345928.1853,
                ctimeMs: 1626196358626.5027,
                birthtimeMs: 1631043564072.1543,
                atime: '2021-09-07T19:39:24.588Z',
                mtime: '2021-07-13T17:12:25.928Z',
                ctime: '2021-07-13T17:12:38.627Z',
                birthtime: '2021-09-07T19:39:24.072Z'
            }

            const mockUser = 'Rubens'
            process.env.USERNAME = mockUser
            const filename = 'rumos.png'
            jest.spyOn(fs.promises, fs.promises.readdir.name)
                .mockResolvedValue([filename])
            jest.spyOn(fs.promises, fs.promises.stat.name)
                .mockResolvedValue(statMock)
            const result = await FileHelper.getFilesStatus("/tmp")
            const expectedResult = [{
                size: "101 kB",
                lastModified: statMock.birthtime,
                owner: mockUser,
                file: filename
            }]
            expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
            expect(result).toMatchObject(expectedResult)
        })
    })
})
import { Router, type Request } from "express";
import { profileFetchLimiter } from "../middleware/rateLimiter.js";
import { optionalAuth } from "../middleware/auth.js";
import { fetchGitHubProfile } from "../services/github.js";

const router = Router();

router.get('/:username', profileFetchLimiter, optionalAuth, async (
    req: Request<{ username: string }>,
    res,
    next
) => {
    const { username } = req.params

    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {
        return res.status(400).json({ message: 'Invalid GitHub username format.' })
    }

    try {
        const profile = await fetchGitHubProfile(username, req.user?.ghToken)
        res.json(profile)
    } catch (err: unknown) {
        if (err instanceof Error && 'statusCode' in err) {
            if (err.statusCode === 404) {
                return res.status(404).json({ message: err.message })
            }
        }
        next(err)
    }
})

export default router
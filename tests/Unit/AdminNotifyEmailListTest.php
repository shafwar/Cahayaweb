<?php

use App\Support\AdminNotifyEmailList;

it('parses comma and semicolon separated emails', function () {
    $list = AdminNotifyEmailList::parse('a@b.com ; c@d.com, x@y.com');
    expect($list)->toBe(['a@b.com', 'c@d.com', 'x@y.com']);
});

it('drops invalid tokens and dedupes case insensitively', function () {
    $list = AdminNotifyEmailList::parse('bad, A@B.COM, a@b.com');
    expect($list)->toHaveCount(1)->and($list[0])->toBe('a@b.com');
});

it('returns empty for null or blank', function () {
    expect(AdminNotifyEmailList::parse(null))->toBe([])
        ->and(AdminNotifyEmailList::parse(''))->toBe([])
        ->and(AdminNotifyEmailList::parse('   '))->toBe([]);
});
